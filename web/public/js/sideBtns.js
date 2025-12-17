let skinsTemp = await fetch("js/json/skins/skins.json")
let defaultsTemp = await fetch("js/json/defaults/defaults.json")
let agentsTemp = await fetch("js/json/skins/agents.json")
let musicTemp = await fetch("js/json/skins/music_kits.json")

window.skinsObject = await skinsTemp.json()
window.defaultsObject = await defaultsTemp.json()
window.agentsObject = await agentsTemp.json()
window.musicObject = await musicTemp.json()

const sideBtnHandler = (activeBtn) => {
    // Remove active background
    let allBtns = [
        "sideBtnKnives",
        "sideBtnGloves",
        "sideBtnRifles",
        "sideBtnPistols",
        "sideBtnSmgs",
        "sideBtnShotguns",
        "sideBtnUtility",
        "sideBtnCTAgents",
        "sideBtnTAgents",
        "sideBtnMusic"
    ]

    allBtns.forEach(element => {
        let elms = document.querySelectorAll(`[id="${element}"]`);
 
        for(var i = 0; i < elms.length; i++) 
            elms[i].classList.remove("active-side")
    });

    // Add active background
    let elms = document.querySelectorAll(`[id="${activeBtn}"]`);
 
    for(var i = 0; i < elms.length; i++) 
        elms[i].classList.add("active-side") 
}

const showDefaults = (type) => {
    document.getElementById("skinsContainer").innerHTML = ""

    if (type == "sfui_invpanel_filter_melee") {
        defaultsObject.forEach(knife => {
            if (knife.weapon_type == "sfui_invpanel_filter_melee") {
                const skinWeapon = selectedSkins.find(element => {
                    if (element.weapon_defindex == weaponIds[knife.weapon_name]) {
                        return true
                    }
                    return false
                })                 

                if (typeof skinWeapon != "undefined") {
                    changeKnifeSkinTemplate(knife, langObject)
                    changeSkinCard(knife, skinWeapon)
                } else {
                    knivesTemplate(knife, langObject)
                }    
                
            }
        })
    } else if (type == "sfui_invpanel_filter_gloves") {
        defaultsObject.forEach(glove => {
            if (glove.weapon_type == "sfui_invpanel_filter_gloves") {
                const skinWeapon = selectedSkins.find(element => {
                    if (element.weapon_defindex == weaponIds[glove.weapon_name]) {
                        return true
                    }
                    return false
                })                 

                if (typeof skinWeapon != "undefined") {
                    changeGlovesSkinTemplate(glove, langObject)
                    changeSkinCard(glove, skinWeapon)
                } else {
                    glovesTemplate(glove, langObject)
                }    
            }
        })
    } else {
        defaultsObject.forEach(weapon => {
            if (weapon.weapon_type == type) {
                const skinWeapon = selectedSkins.find(element => {
                    if (element.weapon_defindex == weaponIds[weapon.weapon_name]) {
                        return true
                    }
                    return false
                })                 

                if (typeof skinWeapon != "undefined") {
                    changeSkinTemplate(weapon, langObject)
                    changeSkinCard(weapon, skinWeapon)
                } else {
                    defaultsTemplate(weapon, langObject, lang)
                }        
            }
        })
    }
}

const showKnives = () => {
    sideBtnHandler("sideBtnKnives")
    showDefaults("sfui_invpanel_filter_melee")
    getTeamKnives()
}

const showGloves = () => {
    sideBtnHandler("sideBtnGloves")
    showDefaults("sfui_invpanel_filter_gloves")
    getTeamGloves()
}

const showRifles = () => {
    sideBtnHandler("sideBtnRifles")
    showDefaults("csgo_inventory_weapon_category_rifles")
}

const showPistols = () => {
    sideBtnHandler("sideBtnPistols")
    showDefaults("csgo_inventory_weapon_category_pistols")
}

const showSmgs = () => {
    sideBtnHandler("sideBtnSmgs")
    showDefaults("csgo_inventory_weapon_category_smgs")
}

const showShotguns = () => {
    sideBtnHandler("sideBtnShotguns")
    showDefaults("csgo_inventory_weapon_category_heavy")
}

const showUtility = () => {
    sideBtnHandler("sideBtnUtility")
    showDefaults("csgo_inventory_weapon_category_utility")
}

const showCTAgents = () => {
    sideBtnHandler("sideBtnCTAgents")
    showAgents("ct")
}

const showTAgents = () => {
    sideBtnHandler("sideBtnTAgents")
    showAgents("t")
}

const showMusic = () => {
    sideBtnHandler("sideBtnMusic")
    showMusicKits()
}

window.showKnives = showKnives
window.showGloves = showGloves
window.showRifles = showRifles
window.showPistols = showPistols
window.showSmgs = showSmgs
window.showShotguns = showShotguns
window.showUtility = showUtility
window.showCTAgents = showCTAgents
window.showTAgents = showTAgents
window.showMusic = showMusic

const sideBtns = document.querySelectorAll("[data-type='sideBtn']")
sideBtns.forEach(btn => {
    let attribute = btn.getAttribute("data-btn-type")
    switch (attribute) {
        case "knives":
            btn.addEventListener("click", showKnives)
            break;
        case "gloves":
            btn.addEventListener("click", showGloves)
            break;
        case "rifles":
            btn.addEventListener("click", showRifles)
            break;
        case "pistols":
            btn.addEventListener("click", showPistols)
            break;
        case "smgs":
            btn.addEventListener("click", showSmgs)
            break;
        case "utlility":
            btn.addEventListener("click", showUtility)
            break;
        case "ctAgents":
            btn.addEventListener("click", showCTAgents)
            break;
        case "tAgents":
            btn.addEventListener("click", showTAgents)
            break;
        case "music":
            btn.addEventListener("click", showMusic)
            break;
        default:
            break;
    }
})

window.getWeaponSkins = (type, weaponid) => {
    socket.emit("get-weapon-skins", {steamid: user.id, weaponid: weaponid, type: type})
}

window.getTeamKnives = () => {
    socket.emit("get-team-knives", {steamid: user.id})
}

window.changeKnife = (weaponid, teamid=0) => {
    let isResetAction = false

    if (teamid != 0) {
        const equipToTeam = document.getElementById(`equip-${(teamid == 2) ? 't' : 'ct'}-${weaponid}`)
        if (!equipToTeam.checked) {
            resetKnife(weaponid, teamid)
	    isResetAction = true
        }
    }

    document.getElementById(`loading-${weaponid}`).style.visibility = "visible"
    document.getElementById(`loading-${weaponid}`).style.opacity = 1

    socket.emit("change-knife", {knifename: weaponid, knifeid: weaponIds[weaponid], steamid: user.id, teamid: teamid, isreset: isResetAction})
}

window.getTeamGloves = () => {
    socket.emit("get-team-gloves", {steamid: user.id})
}

window.changeGloves = (weaponid, teamid=0) => {
    let isResetAction = false

    if (teamid != 0) {
        const equipToTeam = document.getElementById(`equip-${(teamid == 2) ? 't' : 'ct'}-${weaponIds[weaponid]}`)
        if (!equipToTeam.checked) {
            resetGloves(weaponIds[weaponid], teamid)
	    isResetAction = true
        }
    }

    document.getElementById(`loading-${weaponid}`).style.visibility = "visible"
    document.getElementById(`loading-${weaponid}`).style.opacity = 1

    socket.emit("change-gloves", {glovesid: weaponIds[weaponid], steamid: user.id, teamid: teamid, isreset: isResetAction})
}

window.revertEquippedGloves = (weaponid, steamid, teamid=0) => {
    socket.emit("revert-equipped-gloves", {weaponid: weaponid, steamid: steamid, teamid: teamid})
}

window.changeSkin = (weaponid, paintid, teamid=0) => {
    let equipIndex = paintid
    let isResetAction = false

    if (teamid != 0) {
	// Skin selection menu for weapon
        let equipToTeam = document.getElementById(`equip-${(teamid == 2) ? 't' : 'ct'}-${equipIndex}`)
	
	// Adjust element id in main weapons menu
	if (equipToTeam == null) {
	    equipIndex = getKeyByValue(weaponIds, Number(weaponid))
	    equipToTeam = document.getElementById(`equip-${(teamid == 2) ? 't' : 'ct'}-${equipIndex}`)
	} 

        if (!equipToTeam.checked) {
            resetSkin(weaponid, teamid)
	    isResetAction = true
        }
    }

    let spinner = (equipIndex != paintid) ? document.getElementById(`loading-${equipIndex}`) : document.getElementById(`loading-${weaponid}-${equipIndex}`)

    spinner.style.visibility = "visible"
    spinner.style.opacity = 1

    socket.emit("change-skin", {steamid: user.id, weaponid: weaponid, paintid: paintid, teamid: teamid, isreset: isResetAction})
}

window.changeAgent = (steamid, model, team) => {
    socket.emit("change-agent", {steamid: steamid, model: model, team: team})

    document.getElementById(`loading-${model}`).style.visibility = "visible"
    document.getElementById(`loading-${model}`).style.opacity = 1
}

window.changeMusic = (steamid, id) => {
    socket.emit("change-music", {steamid: steamid, id: id})

    document.getElementById(`loading-${id}`).style.visibility = "visible"
    document.getElementById(`loading-${id}`).style.opacity = 1
}

window.resetKnife = (knifeid, teamid) => {
    socket.emit("reset-knife", {steamid: user.id, teamid: teamid, knifeid: knifeid})
}

window.resetGloves = (glovesid, teamid) => {
    socket.emit("reset-gloves", {steamid: user.id, teamid: teamid, glovesid: glovesid})
}

window.resetSkin = (weaponid, teamid=0) => {
    socket.emit("reset-skin", {steamid: user.id, weaponid: weaponid, teamid: teamid})
}

socket.on("weapon-skins-retrieved", data => {
    // Display skins for both T and CT on skin card if any
    if (data.weaponSkins.length == 2 && data.weaponSkins[0].weapon_paint_id != data.weaponSkins[1].weapon_paint_id) {
	let secondarySkin
	skinsObject.forEach(skinWeapon => {
	    if (weaponIds[skinWeapon.weapon.id] == data.weaponid && skinWeapon.paint_index == data.weaponSkins[1].weapon_paint_id) {
		secondarySkin = skinWeapon
	    }
	})

        if (secondarySkin.category.id == "sfui_invpanel_filter_melee") {
            secondarySkin.rarity.color = "#caab05"
	}

        const flexBox = document.createElement("div")
        flexBox.classList.add("d-flex", "flex-column")
	flexBox.setAttribute("id", `${getKeyByValue(weaponIds, Number(data.weaponid))}-secondary-skin`)
        
        const skinImage = document.createElement("img")
        skinImage.classList.add("weapon-img", "mx-auto", "my-3")
	skinImage.src = secondarySkin.image
        skinImage.loading = "lazy"
	skinImage.alt = secondarySkin.image
        skinImage.style = `filter: drop-shadow(0px 0px 20px ${secondarySkin.rarity.color})`
        
        const paintName = document.createElement("p")
        paintName.classList.add("m-0", "text-light", "weapon-skin-title", "mx-auto", "text-center")
	paintName.innerHTML = secondarySkin.pattern.name

	if (secondarySkin.phase != undefined) {
	    paintName.innerHTML += ` (${secondarySkin.phase})`
	}

	paintName.style = `color: ${secondarySkin.rarity.color}; font-size: 0.93rem`
        
        flexBox.appendChild(skinImage)
        document.getElementById(`skin-title-${secondarySkin.weapon.id}`).parentElement.insertAdjacentElement("afterend", flexBox)
        skinImage.insertAdjacentElement("afterend", paintName)

	let weaponTitle = document.getElementById(`weapon-title-${secondarySkin.weapon.id}`)
	let displayedSkinsArea = document.getElementById(`skin-title-${secondarySkin.weapon.id}`).parentElement.parentElement

        weaponTitle.onclick = displayedSkinsArea.onclick

        displayedSkinsArea.insertAdjacentElement("afterend", weaponTitle)
        displayedSkinsArea.classList.add("pb-3")
	displayedSkinsArea.style.paddingTop = "4px"

	document.getElementById(`${secondarySkin.weapon.id}`).parentElement.classList.replace("col-sm-4", "col-md-5")
    }

    const weaponName = getKeyByValue(weaponIds, Number(data.weaponid))

    data.weaponSkins.forEach(function(skin) {
	const weaponSkinTeam = (skin.weapon_team == 2) ? "t" : "ct"

	if (data.type == "guns") {
	    const equipToTeam = document.getElementById(`equip-${weaponSkinTeam}-${weaponName}`)

            equipToTeam.checked = true
	    equipToTeam.labels[0].classList.remove("unchecked-hover-effect")
	    equipToTeam.labels[0].title = (skin.weapon_team == 2) ? "Unequip from T loadout" : "Unequip from CT loadout"
	    equipToTeam.onclick = function() { changeSkin(data.weaponid, skin.weapon_paint_id, skin.weapon_team) }
	}
    })

    const gunId = getKeyByValue(weaponIds, Number(data.weaponid))
    const button = document.getElementById(gunId).querySelectorAll("button")

    if (data.type == "guns") {
        button[button.length - 1].onclick = function() { showSkins(`${gunId}`, true) }
    }
})

socket.on("team-knives-retrieved", data => {
    data.knives.forEach(function (knife, index) {
	if (knife.knife != "weapon_knife") {
	    // T
	    if (knife.weapon_team == 2) {
		const equipToT = document.getElementById(`equip-t-${knife.knife}`)

     	        equipToT.checked = true
		equipToT.labels[0].classList.remove("unchecked-hover-effect")
     	        equipToT.labels[0].title = "Unequip from T loadout"
	    // CT
	    } else if (knife.weapon_team == 3) {
		const equipToCT = document.getElementById(`equip-ct-${knife.knife}`)

    	        equipToCT.checked = true
		equipToCT.labels[0].classList.remove("unchecked-hover-effect")
     	        equipToCT.labels[0].title = "Unequip from CT loadout"
	    }
	}
    });

    if (data.knives.length == 2) {
	if (data.knives[0].knife == data.knives[1].knife) {
            const knifeId = data.knives[0].knife

	    if (knifeId != "weapon_knife") {
                const button = document.getElementById(knifeId).querySelectorAll("button")
                button[button.length - 1].onclick = function() { showSkins(`${knifeId}`, true) }
	    }
	} else {
            const tKnifeId = data.knives[0].knife
            const ctKnifeId = data.knives[1].knife

            if (tKnifeId != "weapon_knife") {
                const tChangeSkinBtn = document.getElementById(tKnifeId).querySelectorAll("button")
                tChangeSkinBtn[tChangeSkinBtn.length - 1].onclick = function() { showSkins(`${tKnifeId}`) }
            }

            if (ctKnifeId != "weapon_knife") {
                const ctChangeSkinBtn = document.getElementById(ctKnifeId).querySelectorAll("button")
                ctChangeSkinBtn[ctChangeSkinBtn.length - 1].onclick = function() { showSkins(`${ctKnifeId}`) }
            }
	}
    }
})

socket.on("knife-changed", data => {
    document.getElementById(`loading-${data.newKnifeName}`).style.opacity = 0
    document.getElementById(`loading-${data.newKnifeName}`).style.visibility = "hidden"

    // Player is equipping a knife to the other team whilst already having it equipped to one team
    if (data.oldKnivesWithTeamId.length == 1) {
	const oldKnife = data.oldKnivesWithTeamId[0]
        const oldEquipToTeam = document.getElementById(`equip-${(oldKnife.weapon_team == 2) ? 't' : 'ct'}-${oldKnife.knife}`)
        if (oldEquipToTeam) {
            oldEquipToTeam.checked = false
	    oldEquipToTeam.labels[0].classList.add("unchecked-hover-effect")
            oldEquipToTeam.labels[0].title = (oldKnife.weapon_team == 2) ? "Equip to T loadout" : "Equip to CT loadout"
        }

    // Player is equipping a knife to both teams without already having it equipped anywhere
    } else {
        data.oldKnivesWithTeamId.forEach(function (oldKnife, index) {
            const oldEquipToTeam = document.getElementById(`equip-${(oldKnife.weapon_team == 2) ? 't' : 'ct'}-${oldKnife.knife}`)
            if (oldEquipToTeam) {
                oldEquipToTeam.checked = false
	        oldEquipToTeam.labels[0].classList.add("unchecked-hover-effect")
                oldEquipToTeam.labels[0].title = (oldKnife.weapon_team == 2) ? "Equip to T loadout" : "Equip to CT loadout"
            }
	})
    }

    getTeamKnives()
})

socket.on("team-gloves-retrieved", data => {
    data.gloves.forEach(function (gloves, index) {
	if (gloves.weapon_defindex > 0) {
	    // T
	    if (gloves.weapon_team == 2) {
                const equipToT = document.getElementById(`equip-t-${gloves.weapon_defindex}`)

     	        equipToT.checked = true
		equipToT.labels[0].classList.remove("unchecked-hover-effect")
     	        equipToT.labels[0].title = "Unequip from T loadout"
	    // CT
	    } else if (gloves.weapon_team == 3) {
                const equipToCT = document.getElementById(`equip-ct-${gloves.weapon_defindex}`)

    	        equipToCT.checked = true
		equipToCT.labels[0].classList.remove("unchecked-hover-effect")
     	        equipToCT.labels[0].title = "Unequip from CT loadout"
	    }
	}
    })

    if (data.gloves.length == 2) {
	if (data.gloves[0].weapon_defindex == data.gloves[1].weapon_defindex) {
	    const glovesId = getKeyByValue(weaponIds, data.gloves[0].weapon_defindex)

	    if (glovesId != null) {
                const button = document.getElementById(glovesId).querySelectorAll("button")
                button[button.length - 1].onclick = function() { showSkins(`${glovesId}`, true) }
	    }
	} else {
            if (data.gloves[0].weapon_defindex > 0) {
	        const tGlovesId = getKeyByValue(weaponIds, data.gloves[0].weapon_defindex)
                const tChangeSkinBtn = document.getElementById(tGlovesId).querySelectorAll("button")
                tChangeSkinBtn[tChangeSkinBtn.length - 1].onclick = function() { showSkins(`${tGlovesId}`) }
            }

            if (data.gloves[1].weapon_defindex > 0) {
	        const ctGlovesId = getKeyByValue(weaponIds, data.gloves[1].weapon_defindex)
                const ctChangeSkinBtn = document.getElementById(ctGlovesId).querySelectorAll("button")
                ctChangeSkinBtn[ctChangeSkinBtn.length - 1].onclick = function() { showSkins(`${ctGlovesId}`) }
            }
	}
    }
})

socket.on("gloves-changed", data => {
    const gloves = getKeyByValue(weaponIds, data.newGlovesId)

    document.getElementById(`loading-${gloves}`).style.opacity = 0
    document.getElementById(`loading-${gloves}`).style.visibility = "hidden"

    // Player is equipping a pair of gloves to the other team whilst already having it equipped to one team
    if (data.oldGlovesWithTeamId.length == 1) {
	const oldGloves = data.oldGlovesWithTeamId[0]

	if (oldGloves != null) {
            const oldEquipToTeam = document.getElementById(`equip-${(oldGloves.weapon_team == 2) ? 't' : 'ct'}-${oldGloves.weapon_defindex}`)

            if (oldEquipToTeam) {
                oldEquipToTeam.checked = false
		oldEquipToTeam.labels[0].classList.add("unchecked-hover-effect")
                oldEquipToTeam.labels[0].title = (oldGloves.weapon_team == 2) ? "Equip to T loadout" : "Equip to CT loadout"
            }
	}

    // Player is equipping a pair of gloves to both teams without already having it equipped anywhere
    } else {
        data.oldGlovesWithTeamId.forEach(function (oldGloves, index) {
            const oldEquipToTeam = document.getElementById(`equip-${(oldGloves.weapon_team == 2) ? 't' : 'ct'}-${oldGloves.weapon_defindex}`)

            if (oldEquipToTeam) {
                oldEquipToTeam.checked = false
		oldEquipToTeam.labels[0].classList.add("unchecked-hover-effect")
                oldEquipToTeam.labels[0].title = (oldGloves.weapon_team == 2) ? "Equip to T loadout" : "Equip to CT loadout"
            }
	})
    }

    getTeamGloves()
})

// Reverting here means to re-equip a pair of gloves to a team if it is already equipped for one team
socket.on("reverted-equipped-gloves", data => {
    if (data.oppositeGlovesId != -1) {
        const team = (data.teamid == 2) ? "t" : "ct"
        document.getElementById(`equip-${team}-${data.oppositeGlovesId}`).checked = true
    }
})

socket.on("skin-changed", data => {
    let weaponName = getKeyByValue(weaponIds, Number(data.weaponid))
    let skinIndex = (document.getElementById(`loading-${weaponName}`) != null) ? weaponName : `${data.weaponid}-${data.paintid}`

    let elms = document.getElementsByClassName("weapon-card")
 
    for (var i = 0; i < elms.length; i++) {
        elms[i].classList.remove("active-card")
    }

    selectedSkins = data.playerSkins
    const updatedSkin = selectedSkins.find(o => o["weapon_defindex"] === Number(data["weaponid"]))

    if (skinIndex != weaponName) {
        document.getElementById(`weapon-${skinIndex}`).classList.add("active-card")
        document.getElementById(`loading-${skinIndex}`).style.opacity = 0
        document.getElementById(`loading-${skinIndex}`).style.visibility = "hidden"

        // Disable tooltip on click
        const displayedTooltip = bootstrap.Tooltip.getOrCreateInstance(document.getElementById(`weapon-${skinIndex}`))
        displayedTooltip.hide()

        // Update weapon skin parameters here if weapon skin is only equipped for a single team
        if (!document.body.contains(document.getElementById(`equip-t-${data.paintid}`))) {
            const floatValue = parseFloat(updatedSkin["weapon_wear"].toFixed(6))

            document.getElementById("floatSlider").value = floatValue
            document.getElementById("float").value = floatValue
            updateFloatText(floatValue)

            document.getElementById("pattern").value = updatedSkin["weapon_seed"]
        }

        if (document.body.contains(document.getElementById(`equip-t-${data.paintid}`))) {
            showSkins(getKeyByValue(weaponIds, updatedSkin.weapon_defindex), true)
        } else {
            showSkins(getKeyByValue(weaponIds, updatedSkin.weapon_defindex))
        }
    } else {
        // Exit weapon skin menu and return to previous menu (a.k.a 'reload')
        document.querySelectorAll(".active-side")[0].onclick()

	// Take weapon skin from opposite team when re-equipping skin to team with empty skin
	const oppositeTeam = (updatedSkin.weapon_team == 2) ? "ct" : "t"
	const equipToTeam = document.getElementById(`equip-${oppositeTeam}-${skinIndex}`)

	equipToTeam.onclick = function() { changeSkin(updatedSkin.weapon_defindex, updatedSkin.weapon_paint_id, (oppositeTeam == "t") ? 2 : 3) }
    }

    window.scrollTo(0, sessionStorage.getItem("last_scrolled_position"))
})

socket.on("agent-changed", data => {
    let elms = document.getElementsByClassName("weapon-card")
 
    for(var i = 0; i < elms.length; i++) {
        elms[i].classList.remove("active-card")
    }

    selectedAgents = data.agents[0]

    document.getElementById(`agent-${data.currentAgent}`).classList.add("active-card")
    document.getElementById(`loading-${data.currentAgent}`).style.opacity = 0
    document.getElementById(`loading-${data.currentAgent}`).style.visibility = "hidden"
})

socket.on("music-changed", data => {
    let elms = document.getElementsByClassName("weapon-card")
 
    for(var i = 0; i < elms.length; i++) {
        elms[i].classList.remove("active-card")
    }

    selectedMusicKit = data.music[0]

    document.getElementById(`music-${data.currentMusic}`).classList.add("active-card")
    document.getElementById(`loading-${data.currentMusic}`).style.opacity = 0
    document.getElementById(`loading-${data.currentMusic}`).style.visibility = "hidden"
})

socket.on("knife-reset", data => {
    const equipToTeam = document.getElementById(`equip-${(data.teamid == 2) ? 't' : 'ct'}-${data.knifeid}`)

    equipToTeam.checked = false
    equipToTeam.labels[0].title = (data.teamid == 2) ? "Equip to T loadout" : "Equip to CT loadout"
})

socket.on("gloves-reset", data => {
    const equipToTeam = document.getElementById(`equip-${(data.teamid == 2) ? 't' : 'ct'}-${data.glovesid}`)

    equipToTeam.checked = false
})

socket.on("skin-reset", data => {
    const weaponName = getKeyByValue(weaponIds, Number(data.weaponid))

    const skinImg = document.getElementById(`img-${weaponName}`)
    if (skinImg != null) {
        skinImg.src = skinImg.alt
        skinImg.style.filter = ""
        skinImg.style = "object-fit: contain; aspect-ratio: 512 / 384"

        document.getElementById(`reset-${weaponName}`).outerHTML = ""
        document.getElementById(`skin-title-${weaponName}`).innerHTML = "Default"
        document.getElementById(`skin-title-${weaponName}`).style = "color: rgb(108, 127, 125); font-size: 0.93rem"
    }

    // Update array of selected skins
    let tempSkins = [];

    selectedSkins.forEach(element => {
        if (element.weapon_defindex != data.weaponid) {
            tempSkins.push(element)
        }
    })
    
    selectedSkins = tempSkins

    // Only disable teams button group for gloves and weapons without a skin selected
    let weaponType = "gun"
    defaultsObject.forEach(weapon => {
        if (weapon.weapon_type == "sfui_invpanel_filter_melee") {
	    if (weapon.weapon_name == weaponName) {
		weaponType = "knife"
		return true
	    } 
	} else if (weapon.weapon_type == "sfui_invpanel_filter_gloves") {
	    if (weapon.weapon_name == weaponName) {
		weaponType = "gloves"
		return true
	    }
	} 
    })

    // Delete secondary weapon skin image and restore to default image
    const secondarySkin = document.getElementById(`${weaponName}-secondary-skin`)
    if (secondarySkin) {
        secondarySkin.parentNode.remove()
        secondarySkin.remove()

        let defaultSkinData = null;
        Object.keys(defaultsObject).forEach(x => defaultSkinData = defaultsObject[x].weapon_defindex === data.weaponid ? defaultsObject[x] : defaultSkinData)

	if (defaultSkinData != null) {
	    let defaultSkinCard = document.createElement("a")
            defaultSkinCard.classList.add("text-decoration-none", "d-flex", "flex-column", "default-hover-effect")
            defaultSkinCard.style = "z-index: 0; padding-top: 4px"
	
	    defaultSkinCard.innerHTML = `
	    	<div class="d-flex flex-column">
                    <img src="${defaultSkinData.image}" class="weapon-img mx-auto my-3" alt="${defaultSkinData.paint_name}">

                    <p class="m-0 text-light weapon-skin-title mx-auto text-center" style="color: rgb(108, 127, 125); font-size: 0.93rem" id="skin-title-${defaultSkinData.paint_name}">Default</p>
		</div>
	    `

            document.getElementById(`loading-${weaponName}`).insertAdjacentElement("afterend", defaultSkinCard)
	    document.getElementById(`${weaponName}`).parentNode.classList.replace("col-md-5", "col-sm-4")
	}
    } else {
	if (!data.weaponSkinsLeft && data.teamid != 0 && document.getElementById(`equip-t-${weaponName}`) == null) {
            showSkins(weaponName, true)
            window.scrollTo(0, sessionStorage.getItem("last_scrolled_position"))
	}
    }

    const weaponId = (weaponType == "gloves") ? data.weaponid : (weaponType == "gun") ? weaponName : "";
    const equipAsT = document.getElementById(`equip-t-${weaponId}`)
    const equipAsCT = document.getElementById(`equip-ct-${weaponId}`)

    if (weaponType != "knife") {
        const teamId = (equipAsT === null && equipAsCT === null) ? 0 : (equipAsT.checked && !equipAsCT.checked) ? 2 : (!equipAsT.checked && equipAsCT.checked) ? 3 : 0

	if (weaponType == "gloves") {
	    revertEquippedGloves(weaponId, user.id, teamId)
	} 

	if (equipAsT && equipAsCT) {
            equipAsT.checked = false
            equipAsCT.checked = false

	    if (weaponType == "gloves" || weaponType == "gun") {
                equipAsT.disabled = true
                equipAsCT.disabled = true
	    }

            const teamsBtnGroup = equipAsT.parentNode
            teamsBtnGroup.setAttribute("data-bs-toggle", "tooltip")
            teamsBtnGroup.setAttribute("data-bs-placement", "bottom")
	    teamsBtnGroup.setAttribute("data-bs-title", "Choose a skin first!")
	    teamsBtnGroup.parentNode.classList.add("default-hover-effect")

            const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
            const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
	}
    }
})

window.showSkins = (skinType, showTeams=false) => {
    document.getElementById("skinsContainer").innerHTML = ""

    skinsObject.forEach(element => {
        if (element.weapon.id == skinType) {
            let rarities = {
                "#b0c3d9": "common",
                "#5e98d9": "uncommon",
                "#4b69ff": "rare",
                "#8847ff": "mythical",
                "#d32ce6": "legendary",
                "#eb4b4b": "ancient",
                "#e4ae39": "contraband"
            }

            let bgColor = "card-uncommon"
            let phase  = ""
            let active = ""
            let steamid = user.id
            let weaponid = weaponIds[element.weapon.id]
            let paintid = element.paint_index
            let float = 0.000001
            let seed = 0

            // Get color of item for card
            if (element.category.id == "sfui_invpanel_filter_melee") { 
                // Gold for all knives
                bgColor = "card-gold"
            } else {
                // Anything else
                bgColor = `card-${rarities[element.rarity.color]}`
            }

            // For 'Doppler' phases
            if (typeof element.phase != "undefined") {
                phase = `(${element.phase})`
            }

	    let tEquippedPaintId = false;
	    let ctEquippedPaintId = false;

            // Make outline if this skin is selected
            selectedSkins.forEach(el => {
                if (el.weapon_paint_id == element.paint_index && (el.weapon_defindex == weaponIds[element.weapon.id] || el.model_idx == weaponIds[element.weapon.id])) {
                    active = "active-card"
                    float = el.weapon_wear
                    seed = el.weapon_seed

		    // T
		    if (el.weapon_team == 2) {
		        tEquippedPaintId = el.weapon_paint_id
		    } 
		    // CT
		    else if (el.weapon_team == 3) {
		        ctEquippedPaintId = el.weapon_paint_id
		    }
                }
            })

            let card = document.createElement("div")
            card.classList.add("col-6", "col-sm-4", "col-md-3", "p-2")

            card.innerHTML = `
                <div onclick="changeSkin(\'${weaponIds[element.weapon.id]}\', ${element.paint_index})" id="weapon-${weaponIds[element.weapon.id]}-${element.paint_index}" class="weapon-card rounded-3 d-flex flex-column ${active} ${bgColor} contrast-reset pb-2" data-type="skinCard" data-btn-type="${weaponIds[element.weapon.id]}-${element.paint_index}" data-bs-title="${element.pattern.name} ${phase}">
                    <div style="z-index: 3;" class="loading-card d-flex justify-content-center align-items-center w-100 h-100" id="loading-${weaponIds[element.weapon.id]}-${element.paint_index}">
                        <div class="spinner-border spinner-border-xl" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </div>

                    <button onclick="editModal(\'${element.image}\', \'${element.weapon.name}\', \'${element.pattern.name} ${phase}\', \'${float}\', \'${seed}\', \'${element.weapon.id}\', \'${element.paint_index}\'); event.stopPropagation()" style="z-index: 3;" class="settings d-flex justify-content-center align-items-center bg-light text-dark rounded-circle" data-bs-toggle="modal" data-bs-target="#patternFloat">
                        <i class="fa-solid fa-gear"></i>
                    </button>

                    <img src="${element.image}" class="weapon-img mx-auto my-3" loading="lazy" width="181px" height="136px" alt="${element.name}">
                    
                    <div class="d-flex align-items-center g-3">
                        <p class="m-0 ms-3 text-secondary">
                            <small class="text-roboto">
                                ${element.weapon.name}
                            </small>
                        </p>
                        <div class="skin-dot mx-2"></div>
                    </div>
                    
                    <h5 class="weapon-skin-title text-roboto ms-3 pe-4" id="skin-${element.paint_index}-name">
                        ${element.pattern.name} ${phase}
                    </h5>
                </div>
            `

            document.getElementById("skinsContainer").appendChild(card)

	    // Show full weapon skin name in tooltip if text overflows
            const skin = document.getElementById(`weapon-${weaponIds[element.weapon.id]}-${element.paint_index}`)
            const skinName = document.getElementById(`skin-${element.paint_index}-name`)

            if (isEllipsisActive(skinName)) {
                skin.setAttribute("data-bs-toggle", "tooltip")
                skin.setAttribute("data-bs-placement", "bottom")

                const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
	        const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
	    }
             
	    // Add T and CT button group if weapon is equipped for both teams
	    if (showTeams) {
		    const skinCard = document.getElementById(`weapon-${weaponIds[element.weapon.id]}-${element.paint_index}`)

            	    const teamsBtnGroup = document.createElement("div")
            	    teamsBtnGroup.classList.add("btn-group", "mx-2")
		    teamsBtnGroup.setAttribute("role", "group")

		    teamsBtnGroup.innerHTML = `
		    	<input onclick="changeSkin(\'${weaponIds[element.weapon.id]}\', ${element.paint_index}, 2); event.stopPropagation()" type="checkbox" class="btn-check" id="equip-t-${element.paint_index}" autocomplete="off">
  			<label onclick="event.stopPropagation()" class="btn btn-outline-warning mx-auto my-2 unchecked-hover-effect-skins" for="equip-t-${element.paint_index}" title="Equip to T loadout" style="border: 1px solid #595959; border-right: none"><small><img class="t-logo team-logo"></img></small></label>
		    	<input onclick="changeSkin(\'${weaponIds[element.weapon.id]}\', ${element.paint_index}, 3); event.stopPropagation()" type="checkbox" class="btn-check" id="equip-ct-${element.paint_index}" autocomplete="off">
  			<label onclick="event.stopPropagation()" class="btn btn-outline-primary mx-auto my-2 unchecked-hover-effect-skins" for="equip-ct-${element.paint_index}" title="Equip to CT loadout" style="border: 1px solid #595959"><small><img class="ct-logo team-logo"></img></small></label>
		    `

            	    document.getElementById(`weapon-${weaponIds[element.weapon.id]}-${element.paint_index}`).appendChild(teamsBtnGroup)

		    const equipToT = (tEquippedPaintId != false) ? document.getElementById(`equip-t-${tEquippedPaintId}`) : undefined
		    const equipToCT = (ctEquippedPaintId != false) ? document.getElementById(`equip-ct-${ctEquippedPaintId}`) : undefined

		    if (equipToT != undefined && equipToCT != undefined && tEquippedPaintId == ctEquippedPaintId) {
                        equipToT.checked = true
                        equipToT.labels[0].classList.remove("unchecked-hover-effect-skins")
                        equipToT.labels[0].title = "Unequip from T loadout"

                        equipToCT.checked = true
                        equipToCT.labels[0].classList.remove("unchecked-hover-effect-skins")
                        equipToCT.labels[0].title = "Unequip from CT loadout"
		    }

                    if (equipToT != undefined && tEquippedPaintId != ctEquippedPaintId && tEquippedPaintId == element.paint_index) {
                        equipToT.checked = true
                        equipToT.labels[0].classList.remove("unchecked-hover-effect-skins")
                        equipToT.labels[0].title = "Unequip from T loadout"
                    } 
                    
                    if (equipToCT != undefined && ctEquippedPaintId != tEquippedPaintId && ctEquippedPaintId == element.paint_index) {
                        equipToCT.checked = true
                        equipToCT.labels[0].classList.remove("unchecked-hover-effect-skins")
                        equipToCT.labels[0].title = "Unequip from CT loadout"
                    }
	    }
        }
    });
}

window.addEventListener("scroll", () => {
        sessionStorage.setItem("last_scrolled_position", window.scrollY)
})
