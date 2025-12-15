const query = require("../database/db").query
const Logger = require("../utils/logger")
const { exec } = require("node:child_process")

// TODO: Check if player has weapon equipped first (this should only apply to guns, not knives and gloves)
// NOTE: This function needs more error handling on the plugin's side (maybe switch to promises, cause this callback hell is pretty ugly)
function refreshWeaponsInServer(steamid, teamid, weaponid) {
    exec(`./rcon 'css_teamid ${steamid}'`, (err, stdout) => {
        if (err) return;

        // Only refresh if skin change from website applies to both teams or the currently joined one
        if (teamid == 0 || stdout == teamid) {
            exec(`./rcon 'css_wp_steamid ${steamid}'`, (err) => {
                if (err) return;
            })
        }
    })
}

module.exports = (io, socket) => {
    async function getWeaponSkins(data) {
        const weaponSkins = await query(`SELECT weapon_team, weapon_paint_id FROM wp_player_skins WHERE steamid = ${data.steamid} AND weapon_defindex = ${data.weaponid}`)
	socket.emit("weapon-skins-retrieved", {weaponid : data.weaponid, type: data.type, weaponSkins: weaponSkins})
    }

    async function getTeamKnives(data) {
        const getKnives = await query(`SELECT weapon_team, knife FROM wp_player_knife WHERE steamid = ${data.steamid}`)
	socket.emit("team-knives-retrieved", {knives: getKnives})
    }

    async function getTeamGloves(data) {
        const getGloves = await query(`SELECT weapon_team, weapon_defindex FROM wp_player_gloves WHERE steamid = ${data.steamid}`)
	socket.emit("team-gloves-retrieved", {gloves: getGloves})
    }

    async function changeKnife(data) {
        Logger.sql.trace(`User ${data.steamid} changed their knife to ${data.knifename}`)

	var oldKnivesWithTeamId = []

	// Both teams
	if (data.teamid == 0) { 
	    const getOldKnives = await query(`SELECT weapon_team, knife FROM wp_player_knife WHERE steamid = ${data.steamid}`)

	    const oldKnifeId = (getOldKnives[0].knife == data.knifename) ? getOldKnives[1] : (getOldKnives[1].knife == data.knifename) ? getOldKnives[0] : undefined
	    if (oldKnifeId != undefined) {
		oldKnivesWithTeamId.push(oldKnifeId)
	    } else {
		oldKnivesWithTeamId = getOldKnives
	    }
	} else {
	    const getOldKnife = await query(`SELECT weapon_team, knife FROM wp_player_knife WHERE steamid = ${data.steamid} AND weapon_team = ${data.teamid}`)

	    oldKnivesWithTeamId.push(getOldKnife[0])
	}

        const getKnives = await query(`SELECT * FROM wp_player_knife WHERE steamid = ${data.steamid}`)
        if (getKnives.length == 2) {
	    // T || CT
	    if (data.teamid == 2 || data.teamid == 3) {
                await query(`UPDATE wp_player_knife SET knife = '${data.knifename}' WHERE steamid = ${data.steamid} AND weapon_team = ${data.teamid}`)
	    } else {
                await query(`UPDATE wp_player_knife SET knife = '${data.knifename}' WHERE steamid = ${data.steamid}`)

		// Sync existing knife skins if player equipped the same knife for both teams
		const knifeSkins = await query (`SELECT weapon_team, weapon_paint_id, weapon_wear, weapon_seed FROM wp_player_skins WHERE steamid = ${data.steamid} AND weapon_defindex = ${data.knifeid}`)
		if (knifeSkins.length == 1) {
		    const oppositeTeamId = (knifeSkins[0].weapon_team == 2) ? 3 : 2

            	    await query(`INSERT INTO wp_player_skins (steamid, weapon_defindex, weapon_team, weapon_paint_id, weapon_wear, weapon_seed) VALUES ( ${data.steamid}, ${data.knifeid}, ${oppositeTeamId}, ${knifeSkins[0].weapon_paint_id}, ${knifeSkins[0].weapon_wear}, ${knifeSkins[0].weapon_seed} )`)
		}
	    }
        } else {
	    if (!data.isreset) {
	        // T || CT
	        if (data.teamid == 2 || data.teamid == 3) {
                    await query(`INSERT INTO wp_player_knife (steamid, weapon_team, knife) values (${data.steamid}, ${data.teamid}, '${data.knifename}')`)
	        } else {
                    await query(`INSERT INTO wp_player_knife (steamid, weapon_team, knife) values (${data.steamid}, 2, '${data.knifename}')`)
                    await query(`INSERT INTO wp_player_knife (steamid, weapon_team, knife) values (${data.steamid}, 3, '${data.knifename}')`)
	        }
	    }
        }

        socket.emit("knife-changed", {oldKnivesWithTeamId: oldKnivesWithTeamId, newKnife: data.knifename})
	
        refreshWeaponsInServer(data.steamid, data.teamid, data.knifeid);
    }

    async function changeGloves(data) {
        Logger.sql.trace(`User ${data.steamid} changed their gloves to ${data.glovesid}`)

	var oldGlovesWithTeamId = []

	// Both teams
	if (data.teamid == 0) { 
	    const getOldGlovesAll = await query(`SELECT weapon_team, weapon_defindex FROM wp_player_gloves WHERE steamid = ${data.steamid}`)

	    const oldGlovesId = (getOldGlovesAll[0].weapon_defindex == data.glovesid) ? getOldGlovesAll[1] : (getOldGlovesAll[1].weapon_defindex == data.glovesid) ? getOldGlovesAll[0] : undefined
	    if (oldGlovesId != undefined) {
		oldGlovesWithTeamId.push(oldGlovesId)
	    } else {
		oldGlovesWithTeamId = getOldGlovesAll
	    }
	} else {
	    const getOldGloves = await query(`SELECT weapon_team, weapon_defindex FROM wp_player_gloves WHERE steamid = ${data.steamid} AND weapon_team = ${data.teamid}`)

	    oldGlovesWithTeamId.push(getOldGloves[0])
	}

        const getGloves = await query(`SELECT * FROM wp_player_gloves WHERE steamid = ${data.steamid}`)
        if (getGloves.length == 2) {
	    // T || CT
	    if (data.teamid == 2 || data.teamid == 3) {
            	await query(`UPDATE wp_player_gloves SET weapon_defindex = '${data.glovesid}' WHERE steamid = ${data.steamid} AND weapon_team = ${data.teamid}`)
	    } else {
            	await query(`UPDATE wp_player_gloves SET weapon_defindex = '${data.glovesid}' WHERE steamid = ${data.steamid}`)

		// Sync existing gloves' skins if player equipped same pair of gloves for both teams
		const glovesSkins = await query (`SELECT weapon_team, weapon_paint_id, weapon_wear, weapon_seed FROM wp_player_skins WHERE steamid = ${data.steamid} AND weapon_defindex = ${data.glovesid}`)
		if (glovesSkins.length == 1) {
		    const oppositeTeamId = (glovesSkins[0].weapon_team == 2) ? 3 : 2

            	    await query(`INSERT INTO wp_player_skins (steamid, weapon_defindex, weapon_team, weapon_paint_id, weapon_wear, weapon_seed) VALUES ( ${data.steamid}, ${data.glovesid}, ${oppositeTeamId}, ${glovesSkins[0].weapon_paint_id}, ${glovesSkins[0].weapon_wear}, ${glovesSkins[0].weapon_seed} )`)
		}
	    }
        } else {
	    if (!data.isreset) {
	        // T || CT
	        if ((data.teamid == 2 || data.teamid == 3)) {
                    await query(`INSERT INTO wp_player_gloves (steamid, weapon_team, weapon_defindex) values (${data.steamid}, ${data.teamid}, '${data.glovesid}')`)
	        } else {
		    if (getGloves.length == 1) {
               	        await query(`INSERT INTO wp_player_gloves (steamid, weapon_team, weapon_defindex) values (${data.steamid}, ${(getGloves[0].weapon_team == 2) ? 3 : 2}, '${data.glovesid}')`)
		    } else {
               	        await query(`INSERT INTO wp_player_gloves (steamid, weapon_team, weapon_defindex) values (${data.steamid}, 2, '${data.glovesid}')`)
               	        await query(`INSERT INTO wp_player_gloves (steamid, weapon_team, weapon_defindex) values (${data.steamid}, 3, '${data.glovesid}')`)
		    }
	        }
	    }
        }

        socket.emit("gloves-changed", {oldGlovesWithTeamId: oldGlovesWithTeamId, newGloves: data.glovesid})
	
	refreshWeaponsInServer(data.steamid, data.teamid, data.glovesid);
    }

    async function revertEquippedGloves(data) {
	 // T || CT
	 if (data.teamid == 2 || data.teamid == 3) {
             await query(`DELETE FROM wp_player_gloves WHERE steamid = ${data.steamid} AND weapon_team = ${data.teamid} AND weapon_defindex = ${data.weaponid}`)
         
         // Both teams
	 } else if (data.teamid == 0) {
             await query(`DELETE FROM wp_player_gloves WHERE steamid = ${data.steamid} AND weapon_defindex = ${data.weaponid}`)
	 }

	 // Revert to same pair of gloves equipped on the opposite team (if any)
         const oppositeTeamId = (data.teamid == 2) ? 3 : 2
	 const oppositeTeamEquippedGloves = await query(`SELECT weapon_defindex FROM wp_player_gloves WHERE steamid = ${data.steamid} AND weapon_team = ${oppositeTeamId}`)

	 if (data.teamid != 0 && oppositeTeamEquippedGloves.length == 1) {
             await query(`INSERT INTO wp_player_gloves (steamid, weapon_team, weapon_defindex) values (${data.steamid}, ${data.teamid}, '${oppositeTeamEquippedGloves[0].weapon_defindex}')`)
	 }

	 socket.emit("reverted-equipped-gloves", {teamid: data.teamid, oppositeGlovesId: (data.teamid != 0) ? oppositeTeamEquippedGloves[0].weapon_defindex : -1})
	 
	 refreshWeaponsInServer(data.steamid, data.teamid, data.weaponid);
    }

    async function changeSkin(data) {
        Logger.sql.trace(`User ${data.steamid} changed their skin of ${data.weaponid} to ${data.paintid}`)

        const getSkin = await query(`SELECT * FROM wp_player_skins WHERE weapon_defindex = ${data.weaponid} AND steamid = ${data.steamid}`)

        if (getSkin.length == 2) {
	    // T || CT
	    if (data.teamid == 2 || data.teamid == 3) {
            	await query(`UPDATE wp_player_skins SET weapon_paint_id = ${data.paintid} WHERE steamid = ${data.steamid} AND weapon_team = ${data.teamid} AND weapon_defindex = ${data.weaponid}`)
	    } else {
             	await query(`UPDATE wp_player_skins SET weapon_paint_id = ${data.paintid} WHERE steamid = ${data.steamid} AND weapon_defindex = ${data.weaponid}`)
	    }
        } else {
	    if (!data.isreset) {
	        // T || CT
	        if (data.teamid == 2 || data.teamid == 3) {
			const teamSkin = await query (`SELECT weapon_team, weapon_paint_id, weapon_wear, weapon_seed FROM wp_player_skins WHERE steamid = ${data.steamid} AND weapon_defindex = ${data.weaponid} AND weapon_team = ${data.teamid}`)
			if (teamSkin.length == 1) {
                		await query(`UPDATE wp_player_skins SET weapon_paint_id = ${data.paintid} WHERE steamid = ${data.steamid} AND weapon_defindex = ${data.weaponid} AND weapon_team = ${data.teamid}`)
			} else {
                		await query(`INSERT INTO wp_player_skins (steamid, weapon_defindex, weapon_team, weapon_paint_id) VALUES ( ${data.steamid}, ${data.weaponid}, ${data.teamid}, ${data.paintid} )`)
			}
	        } else {
		    if (getSkin.length == 1) {
                	await query(`INSERT INTO wp_player_skins (steamid, weapon_defindex, weapon_team, weapon_paint_id) VALUES ( ${data.steamid}, ${data.weaponid}, ${(getSkin[0].weapon_team == 2) ? 3 : 2}, ${data.paintid} )`)
               		await query(`UPDATE wp_player_skins SET weapon_paint_id = ${data.paintid} WHERE steamid = ${data.steamid} AND weapon_defindex = ${data.weaponid} AND weapon_team = ${getSkin[0].weapon_team}`)
		    } else {
                	await query(`INSERT INTO wp_player_skins (steamid, weapon_defindex, weapon_team, weapon_paint_id) VALUES ( ${data.steamid}, ${data.weaponid}, 2, ${data.paintid} )`)
                	await query(`INSERT INTO wp_player_skins (steamid, weapon_defindex, weapon_team, weapon_paint_id) VALUES ( ${data.steamid}, ${data.weaponid}, 3, ${data.paintid} )`)
		    }
	        }
	    }
        }

        const playerSkins = await query(`SELECT * FROM wp_player_skins WHERE steamid = ${data.steamid}`)
        socket.emit("skin-changed", {weaponid: data.weaponid, paintid: data.paintid, playerSkins: playerSkins})

        refreshWeaponsInServer(data.steamid, data.teamid, data.weaponid);
    }

    async function changeAgent(data) {
        Logger.sql.trace(`User ${data.steamid} changed their agent to ${data.model}`)
        const getAgent = await query(`SELECT * FROM wp_player_agents WHERE steamid = ${data.steamid}`)
        if (getAgent.length >= 1) {
            await query(`UPDATE wp_player_agents SET agent_${data.team} = '${data.model}' WHERE steamid = ${data.steamid}`)
        } else {
            await query(`INSERT INTO wp_player_agents (steamid, agent_${data.team}) values (${data.steamid}, '${data.model}')`)
        }

        socket.emit("agent-changed", {
            agents: await query(`SELECT * FROM wp_player_agents WHERE steamid = ${data.steamid}`),
            currentAgent: data.model
        })

        refreshWeaponsInServer(data.steamid, data.teamid);
    }

    async function changeMusic(data) {
        Logger.sql.trace(`User ${data.steamid} changed their music kit to ${data.id}`)

        const getMusic = await query(`SELECT * FROM wp_player_music WHERE steamid = ${data.steamid}`)

        if (getMusic.length >= 1) {
            await query(`UPDATE wp_player_music SET music_id = ${data.id} WHERE steamid = ${data.steamid}`)
        } else {
            await query(`INSERT INTO wp_player_music (steamid, weapon_team, music_id) VALUES ( ${data.steamid}, 0, ${data.id} )`)
        }

        const newMusic = await query(`SELECT * FROM wp_player_music WHERE steamid = ${data.steamid}`)

        socket.emit("music-changed", {currentMusic: data.id, music: newMusic})
        
	refreshWeaponsInServer(data.steamid, data.teamid);
    }

    async function resetKnife(data) {
        await query(`DELETE FROM wp_player_knife WHERE steamid = ${data.steamid} AND weapon_team = ${data.teamid} AND knife = '${data.knifeid}'`)
        socket.emit("knife-reset", {knifeid: data.knifeid, teamid: data.teamid})

        await query(`INSERT INTO wp_player_knife (steamid, weapon_team, knife) values (${data.steamid}, ${data.teamid}, 'weapon_knife')`)

        refreshWeaponsInServer(data.steamid, data.teamid, data.knifeid);
    }

    async function resetGloves(data) {
        await query(`DELETE FROM wp_player_gloves WHERE steamid = ${data.steamid} AND weapon_team = ${data.teamid} AND weapon_defindex = ${data.glovesid}`)
        socket.emit("gloves-reset", {glovesid: data.glovesid, teamid: data.teamid})

        await query(`INSERT INTO wp_player_gloves (steamid, weapon_team, weapon_defindex) values (${data.steamid}, ${data.teamid}, 0)`)

        refreshWeaponsInServer(data.steamid, data.teamid, data.glovesid);
    }

    async function resetSkin(data) {
	// T || CT
	if (data.teamid == 2 || data.teamid == 3) {
            await query(`DELETE FROM wp_player_skins WHERE steamid = ${data.steamid} AND weapon_team = ${data.teamid} AND weapon_defindex = ${data.weaponid}`)
	} else {
            await query(`DELETE FROM wp_player_skins WHERE steamid = ${data.steamid} AND weapon_defindex = ${data.weaponid}`)
	}

        socket.emit("skin-reset", {weaponid: data.weaponid})
        refreshWeaponsInServer(data.steamid, data.teamid, data.weaponid);
    }

    async function changeParams(data) {
        data.float = (data.float == "") ? "0.000001" : data.float
        data.seed = (data.seed == "") ? "1" : data.seed
        
	// T || CT
	if (data.teamid == 2 || data.teamid == 3) {
            await query(`UPDATE wp_player_skins SET weapon_wear = ${data.float}, weapon_seed = ${data.seed} WHERE steamid = ${data.steamid} AND weapon_defindex = ${data.weaponid} AND weapon_paint_id = ${data.paintid} AND weapon_team = ${data.teamid}`)
	} else {
            await query(`UPDATE wp_player_skins SET weapon_wear = ${data.float}, weapon_seed = ${data.seed} WHERE steamid = ${data.steamid} AND weapon_defindex = ${data.weaponid} AND weapon_paint_id = ${data.paintid}`)
	}

	const teamid = await query(`SELECT weapon_team FROM wp_player_skins WHERE steamid = ${data.steamid} AND weapon_defindex = ${data.weaponid} AND weapon_paint_id = ${data.paintid}`)

        socket.emit("params-changed", {steamid: data.steamid, weaponid: data.weaponid, paintid: data.paintid, teamid: teamid[0], float: data.float, seed: data.seed})
        
	refreshWeaponsInServer(data.steamid, data.teamid, data.weaponid);
    }

    socket.on("get-weapon-skins", getWeaponSkins);
    socket.on("get-team-knives", getTeamKnives);
    socket.on("get-team-gloves", getTeamGloves);
    socket.on("change-knife", changeKnife);
    socket.on("change-gloves", changeGloves);
    socket.on("revert-equipped-gloves", revertEquippedGloves);
    socket.on("change-skin", changeSkin);
    socket.on("change-agent", changeAgent);
    socket.on("change-music", changeMusic);
    socket.on("reset-knife", resetKnife);
    socket.on("reset-gloves", resetGloves);
    socket.on("reset-skin", resetSkin);
    socket.on("change-params", changeParams);
}
