window.defaultsTemplate = (weapon, langObject, lang) => {
    let card = document.createElement("div")
    card.classList.add("col-6", "col-sm-4", "col-md-3", "p-2")

    card.innerHTML = `
    <div class="rounded-3 d-flex flex-column card-common weapon-card weapon_knife" id="${weapon.weapon_name}">
	<div id="single-team-${weapon.weapon_name}-padding-1" style="margin-top: 36px"></div>
        <div style="z-index: 3;" class="loading-card d-flex justify-content-center align-items-center w-100 h-100" id="loading-${weapon.weapon_name}">
            <div class="spinner-border spinner-border-xl" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>

        <a class="text-decoration-none d-flex flex-column default-hover-effect" style="z-index: 0;">
                <img src="${weapon.image}" class="weapon-img mx-auto my-3" loading="lazy" alt="${weapon.paint_name}">
                
                <p class="m-0 text-light weapon-skin-title mx-auto text-center" style="color: rgb(108, 127, 125); font-size: 0.93rem" id="skin-title-${weapon.paint_name}">Default</p>
                <p class="m-0 text-light weapon-skin-title mx-auto text-center">${weapon.paint_name}</p>
        </a>
	<div id="single-team-${weapon.weapon_name}-padding-2" style="margin-bottom: 26px"></div>
	<div class="mx-auto d-flex flex-column">
            <button onclick="showSkins(\'${weapon.weapon_name}\')" class="btn btn-primary text-warning mx-auto my-2" id="show-${weapon.weapon_name}-skins-btn" style="z-index: 1;"><small>${langObject.changeSkin}</small></button>
        </div>
    </div>
    `

    document.getElementById("skinsContainer").appendChild(card)  

    if (weapon.both_teams) {
	document.getElementById(`single-team-${weapon.weapon_name}-padding-1`).remove()
	document.getElementById(`single-team-${weapon.weapon_name}-padding-2`).remove()

	let weaponCard = document.getElementById(`show-${weapon.weapon_name}-skins-btn`)
	weaponCard.onclick = function() { showSkins(weapon.weapon_name, true) }
	weaponCard.parentNode.classList.add("default-hover-effect")


	let teamsBtnGroup = document.createElement("div")
	teamsBtnGroup.classList.add("btn-group", "mx-2", "my-1")
	teamsBtnGroup.setAttribute("role", "group")
	teamsBtnGroup.setAttribute("data-bs-toggle", "tooltip")
	teamsBtnGroup.setAttribute("data-bs-placement", "bottom")
	teamsBtnGroup.setAttribute("data-bs-title", "Choose a skin first!")

	teamsBtnGroup.innerHTML = `
	    <input type="checkbox" class="btn-check" id="equip-t-${weapon.weapon_name}" disabled autocomplete="off">
            <label class="btn btn-outline-warning mx-auto my-2" for="equip-t-${weapon.weapon_name}" style="border: 1px solid #363636; border-right: none"><small><img class="t-logo team-logo"></img></small></label>
            <input type="checkbox" class="btn-check" id="equip-ct-${weapon.weapon_name}" disabled autocomplete="off">
            <label class="btn btn-outline-primary mx-auto my-2" for="equip-ct-${weapon.weapon_name}" style="border: 1px solid #363636"><small><img class="ct-logo team-logo"></img></small></label>
	`

        weaponCard.insertAdjacentElement("beforebegin", teamsBtnGroup)

        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
        const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
    }
}

window.changeSkinTemplate = (weapon, langObject) => {
    let card = document.createElement("div")
    card.classList.add("col-6", "col-sm-4", "col-md-3", "p-2")

    card.innerHTML = `
    <div class="rounded-3 d-flex flex-column card-common weapon-card weapon_knife" id="${weapon.weapon_name}">
	<div id="single-team-${weapon.weapon_name}-padding-1" style="margin-top: 36px"></div>
        <button id="reset-${weapon.weapon_name}" onclick="resetSkin(${weapon.weapon_defindex})" style="z-index: 3;" class="revert d-flex justify-content-center align-items-center text-danger rounded-circle">
            <i class="fa-solid fa-rotate-right"></i>
        </button>

        <div style="z-index: 3;" class="loading-card d-flex justify-content-center align-items-center w-100 h-100" id="loading-${weapon.weapon_name}">
            <div class="spinner-border spinner-border-xl" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>

        <a class="text-decoration-none d-flex flex-row" style="z-index: 0;">
		<div class="d-flex flex-column">
                	<img src="${weapon.image}" class="weapon-img mx-auto my-3" loading="lazy" alt="${weapon.image}" id="img-${weapon.weapon_name}">
                	
                	<p class="m-0 text-light weapon-skin-title mx-auto text-center" id="skin-title-${weapon.weapon_name}"></p>
                	<p class="m-0 text-light weapon-skin-title mx-auto text-center" id="weapon-title-${weapon.weapon_name}">${weapon.paint_name}</p>
		</div>
        </a>
	<div id="single-team-${weapon.weapon_name}-padding-2" style="margin-top: 26px"></div>
	<div class="mx-auto d-flex flex-column">
            <button onclick="showSkins(\'${weapon.weapon_name}\')" class="btn btn-primary text-warning mx-auto my-2" id="show-${weapon.weapon_name}-skins-btn" style="z-index: 1;"><small>${langObject.changeSkin}</small></button>
        </div>
    </div>
    `

    document.getElementById("skinsContainer").appendChild(card)  

    if (weapon.both_teams) {
        getWeaponSkins("guns", weapon.weapon_defindex)

	document.getElementById(`single-team-${weapon.weapon_name}-padding-1`).remove()
	document.getElementById(`single-team-${weapon.weapon_name}-padding-2`).remove()

	let weaponCard = document.getElementById(`show-${weapon.weapon_name}-skins-btn`)
	
	let teamsBtnGroup = document.createElement("div")
	teamsBtnGroup.classList.add("btn-group", "mx-2", "my-1")
	teamsBtnGroup.setAttribute("role", "group")

	teamsBtnGroup.innerHTML = `
	    <input type="checkbox" class="btn-check" id="equip-t-${weapon.weapon_name}" autocomplete="off">
            <label class="btn btn-outline-warning mx-auto my-2 unchecked-hover-effect" for="equip-t-${weapon.weapon_name}" title="Equip to T loadout" style="border: 1px solid #363636; border-right: none"><small><img class="t-logo team-logo"></img></small></label>
            <input type="checkbox" class="btn-check" id="equip-ct-${weapon.weapon_name}" autocomplete="off">
            <label class="btn btn-outline-primary mx-auto my-2 unchecked-hover-effect" for="equip-ct-${weapon.weapon_name}" title="Equip to CT loadout" style="border: 1px solid #363636"><small><img class="ct-logo team-logo"></img></small></label>
	`

        weaponCard.insertAdjacentElement("beforebegin", teamsBtnGroup)
    }
}

window.changeKnifeSkinTemplate = (knife, langObject) => {
    let card = document.createElement("div")
    card.classList.add("col-6", "col-sm-4", "col-md-3", "p-2")

    getWeaponSkins("knives", knife.weapon_defindex)

    card.innerHTML = `
    <div class="rounded-3 d-flex flex-column card-common weapon-card weapon_knife" id="${knife.weapon_name}">
        <button id="reset-${knife.weapon_name}" onclick="resetSkin(${knife.weapon_defindex})" style="z-index: 3;" class="revert d-flex justify-content-center align-items-center text-danger rounded-circle">
            <i class="fa-solid fa-rotate-right"></i>
        </button>

        <div style="z-index: 3;" class="loading-card d-flex justify-content-center align-items-center w-100 h-100" id="loading-${knife.weapon_name}">
            <div class="spinner-border spinner-border-xl" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>

        <a onclick="changeKnife(\'${knife.weapon_name}\')" class="text-decoration-none d-flex flex-row" style="z-index: 0;">
		<div class="d-flex flex-column">
                	<img src="${knife.image}" class="weapon-img mx-auto my-3" loading="lazy" alt="${knife.image}" id="img-${knife.weapon_name}">
                	
                	<p class="m-0 text-light weapon-skin-title mx-auto text-center" id="skin-title-${knife.weapon_name}"></p>
                	<p class="m-0 text-light weapon-skin-title mx-auto text-center" id="weapon-title-${knife.weapon_name}">${knife.paint_name}</p>
		</div>
        </a>
	<div class="mx-auto d-flex flex-column">
		<div class="btn-group" role="group">
			<input onclick="changeKnife(\'${knife.weapon_name}\', 2)" type="checkbox" class="btn-check" id="equip-t-${knife.weapon_name}" autocomplete="off">
			<label class="btn btn-outline-warning mx-auto my-2 unchecked-hover-effect" for="equip-t-${knife.weapon_name}" title="Equip to T loadout" style="border: 1px solid #363636; border-right: none"><small><img class="t-logo team-logo"></img></small></label>
			<input onclick="changeKnife(\'${knife.weapon_name}\', 3)" type="checkbox" class="btn-check" id="equip-ct-${knife.weapon_name}" autocomplete="off">
			<label class="btn btn-outline-primary mx-auto my-2 unchecked-hover-effect" for="equip-ct-${knife.weapon_name}" title="Equip to CT loadout" style="border: 1px solid #363636"><small><img class="ct-logo team-logo"></img></small></label>
		</div>
        	<button onclick="showSkins(\'${knife.weapon_name}\')" class="btn btn-primary text-warning mx-auto my-2" style="z-index: 1;"><small>${langObject.changeSkin}</small></button>
	</div>
    </div>
    `

    document.getElementById("skinsContainer").appendChild(card)
}

window.changeSkinCard = (weapon, selectedSkin) => {
    skinsObject.forEach(skinWeapon => {
        if (weaponIds[skinWeapon.weapon.id] == weapon.weapon_defindex && skinWeapon.paint_index == selectedSkin.weapon_paint_id) {
            if (skinWeapon.category.id == "sfui_invpanel_filter_melee") {
                skinWeapon.rarity.color = "#caab05"
            }
            
            document.getElementById(`img-${weapon.weapon_name}`).src = skinWeapon.image
            document.getElementById(`img-${weapon.weapon_name}`).style = `filter: drop-shadow(0px 0px 20px ${skinWeapon.rarity.color});`
	    document.getElementById(`skin-title-${weapon.weapon_name}`).innerHTML = skinWeapon.pattern.name
	    if (skinWeapon.phase != undefined) {
	        document.getElementById(`skin-title-${weapon.weapon_name}`).innerHTML += ` (${skinWeapon.phase})`
	    }

	    document.getElementById(`skin-title-${weapon.weapon_name}`).style= `color: ${skinWeapon.rarity.color}; font-size: 0.93rem`

	    document.getElementById(`${weapon.weapon_name}`).style= `border-color: ${skinWeapon.rarity.color}`
        }
    })
}

window.knivesTemplate = (knife, langObject) => {
    let card = document.createElement("div")
    card.classList.add("col-6", "col-sm-4", "col-md-3", "p-2")

    card.innerHTML = `
    <div class="rounded-3 d-flex flex-column card-common weapon-card weapon_knife" id="${knife.weapon_name}">
        <div style="z-index: 3;" class="loading-card d-flex justify-content-center align-items-center w-100 h-100" id="loading-${knife.weapon_name}">
            <div class="spinner-border spinner-border-xl" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>

        <a onclick="changeKnife(\'${knife.weapon_name}\')" class="text-decoration-none d-flex flex-column" style="z-index: 0;">
                <img src="${knife.image}" class="weapon-img mx-auto my-3" loading="lazy" alt="${knife.paint_name}">
                
                <p class="m-0 text-light weapon-skin-title mx-auto text-center" style="color: rgb(108, 127, 125); font-size: 0.93rem" id="skin-title-${knife.paint_name}">Default</p>
                <p class="m-0 text-light weapon-skin-title mx-auto text-center">${knife.paint_name}</p>
        </a>
	<div class="mx-auto d-flex flex-column">
		<div class="btn-group" role="group">
			<input onclick="changeKnife(\'${knife.weapon_name}\', 2)" type="checkbox" class="btn-check" id="equip-t-${knife.weapon_name}" autocomplete="off">
			<label class="btn btn-outline-warning mx-auto my-2 unchecked-hover-effect" for="equip-t-${knife.weapon_name}" title="Equip to T loadout" style="border: 1px solid #363636; border-right: none"><small><img class="t-logo team-logo"></img></small></label>
			<input onclick="changeKnife(\'${knife.weapon_name}\', 3)" type="checkbox" class="btn-check" id="equip-ct-${knife.weapon_name}" autocomplete="off">
			<label class="btn btn-outline-primary mx-auto my-2 unchecked-hover-effect" for="equip-ct-${knife.weapon_name}" title="Equip to CT loadout" style="border: 1px solid #363636"><small><img class="ct-logo team-logo"></img></small></label>
		</div>
        	<button onclick="showSkins(\'${knife.weapon_name}\')" class="btn btn-primary text-warning mx-auto my-2" style="z-index: 1;"><small>${langObject.changeSkin}</small></button>
	</div>
    </div>
    `

    document.getElementById("skinsContainer").appendChild(card)
}

window.glovesTemplate = (gloves, langObject) => {
    let card = document.createElement("div")
    card.classList.add("col-6", "col-sm-4", "col-md-3", "p-2")

    card.innerHTML = `
    <div class="rounded-3 d-flex flex-column card-common weapon-card weapon_knife" id="${gloves.weapon_name}">
        <div style="z-index: 3;" class="loading-card d-flex justify-content-center align-items-center w-100 h-100" id="loading-${gloves.weapon_name}">
            <div class="spinner-border spinner-border-xl" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>

        <a class="text-decoration-none d-flex flex-column default-hover-effect" style="z-index: 0;">
                <img src="${gloves.image}" class="weapon-img mx-auto my-3" loading="lazy" alt="${gloves.paint_name}" style="object-fit: contain; aspect-ratio: 512 / 384;">
                
                <p class="m-0 text-light weapon-skin-title mx-auto text-center" style="color: rgb(108, 127, 125); font-size: 0.93rem" id="skin-title-${gloves.paint_name}">Default</p>
                <p class="m-0 text-light weapon-skin-title mx-auto text-center">${gloves.paint_name}</p>
        </a>
	<div class="mx-auto d-flex flex-column">
		<div class="btn-group default-hover-effect" role="group" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Choose a skin first!">
			<input type="checkbox" class="btn-check" id="equip-t-${gloves.weapon_defindex}" disabled autocomplete="off">
			<label class="btn btn-outline-warning mx-auto my-2" for="equip-t-${gloves.weapon_defindex}" title="Equip to T loadout" style="border: 1px solid #363636; border-right: none"><small><img class="t-logo team-logo"></img></small></label>
			<input type="checkbox" class="btn-check" id="equip-ct-${gloves.weapon_defindex}" disabled autocomplete="off">
			<label class="btn btn-outline-primary mx-auto my-2" for="equip-ct-${gloves.weapon_defindex}" title="Equip to CT loadout" style="border: 1px solid #363636"><small><img class="ct-logo team-logo"></img></small></label>
		</div>
        	<button onclick="showSkins(\'${gloves.weapon_name}\')" class="btn btn-primary text-warning mx-auto my-2" style="z-index: 1;"><small>${langObject.changeSkin}</small></button>
	</div>
    </div>
    `

    document.getElementById("skinsContainer").appendChild(card)       

    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
}

window.changeGlovesSkinTemplate = (gloves, langObject) => {
    let card = document.createElement("div")
    card.classList.add("col-6", "col-sm-4", "col-md-3", "p-2")

    getWeaponSkins("gloves", gloves.weapon_defindex)

    card.innerHTML = `
    <div class="rounded-3 d-flex flex-column card-common weapon-card weapon_knife" id="${gloves.weapon_name}">
        <button id="reset-${gloves.weapon_name}" onclick="resetSkin(${gloves.weapon_defindex})" style="z-index: 3;" class="revert d-flex justify-content-center align-items-center text-danger rounded-circle">
            <i class="fa-solid fa-rotate-right"></i>
        </button>

        <div style="z-index: 3;" class="loading-card d-flex justify-content-center align-items-center w-100 h-100" id="loading-${gloves.weapon_name}">
            <div class="spinner-border spinner-border-xl" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>

        <a onclick="changeGloves(\'${gloves.weapon_name}\')" class="text-decoration-none d-flex flex-row" style="z-index: 0;">
		<div class="d-flex flex-column">
                	<img src="${gloves.image}" class="weapon-img mx-auto my-3" loading="lazy" alt="${gloves.image}" id="img-${gloves.weapon_name}" style="object-fit: contain; aspect-ratio: 512 / 384;">
                	<p class="m-0 text-light weapon-skin-title mx-auto text-center" id="skin-title-${gloves.weapon_name}"></p>
                	<p class="m-0 text-light weapon-skin-title mx-auto text-center" id="weapon-title-${gloves.weapon_name}">${gloves.paint_name}</p>
		</div>
        </a>
	<div class="mx-auto d-flex flex-column">
		<div class="btn-group" role="group" data-bs-title="Choose a skin first!">
			<input onclick="changeGloves(\'${gloves.weapon_name}\', 2); event.stopPropagation()" type="checkbox" class="btn-check" id="equip-t-${gloves.weapon_defindex}" autocomplete="off">
			<label class="btn btn-outline-warning mx-auto my-2 unchecked-hover-effect" for="equip-t-${gloves.weapon_defindex}" title="Equip to T loadout" style="border: 1px solid #363636; border-right: none"><small><img class="t-logo team-logo"></img></small></label>
			<input onclick="changeGloves(\'${gloves.weapon_name}\', 3); event.stopPropagation()" type="checkbox" class="btn-check" id="equip-ct-${gloves.weapon_defindex}" autocomplete="off">
			<label class="btn btn-outline-primary mx-auto my-2 unchecked-hover-effect" for="equip-ct-${gloves.weapon_defindex}" title="Equip to CT loadout" style="border: 1px solid #363636"><small><img class="ct-logo team-logo"></img></small></label>
		</div>
        	<button onclick="showSkins(\'${gloves.weapon_name}\')" class="btn btn-primary text-warning mx-auto my-2" style="z-index: 1;"><small>${langObject.changeSkin}</small></button>
	</div>
    </div>
    `

    document.getElementById("skinsContainer").appendChild(card)  
}

window.isEllipsisActive = (element) => {
    const style = window.getComputedStyle(element);
    return (
        style.overflow === "hidden" &&
        style.whiteSpace === "nowrap" &&
        style.textOverflow === "ellipsis" &&
        element.scrollWidth > element.clientWidth
    );
}

window.showAgents = (type) => {
    let team = {
        "ct": 3,
        "t": 2
    }

    document.getElementById("skinsContainer").innerHTML = ""

    agentsObject.forEach(element => {
        if (element.team == team[type]) {
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

            // Make outline if this skin is selected
            if (selectedAgents.agent_t == element.model || selectedAgents.agent_ct == element.model) {
                active = "active-card"
            }
            
            let card = document.createElement("div")
            card.classList.add("col-6", "col-sm-4", "col-md-3", "p-2")

            card.innerHTML = `
                <div onclick="changeAgent(\'${steamid}\', \'${element.model}\', \'${type}\')" id="agent-${element.model}" class="weapon-card rounded-3 d-flex flex-column ${active} ${bgColor} contrast-reset pb-2" data-type="skinCard" data-btn-type="" data-bs-title="${element.agent_name}">
                
                    <div style="z-index: 3;" class="loading-card d-flex justify-content-center align-items-center w-100 h-100" id="loading-${element.model}">
                        <div class="spinner-border spinner-border-xl" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </div>

                    <img src="${element.image}" class="weapon-img mx-auto my-3" loading="lazy" width="181px" height="136px" alt=" ">
                    
                    <div class="d-flex align-items-center g-3">
                    
                    </div>
                    
                    <h5 class="weapon-skin-title text-roboto ms-3 pe-4" id="agent-${element.model}-name">
                        ${element.agent_name}
                    </h5>
                </div>
            `

            document.getElementById("skinsContainer").appendChild(card)

	    // Show full agent name in tooltip if text overflows
	    let agent = document.getElementById(`agent-${element.model}`)
	    let agentName = document.getElementById(`agent-${element.model}-name`)

	    if (isEllipsisActive(agentName)) {
                agent.setAttribute("data-bs-toggle", "tooltip")
                agent.setAttribute("data-bs-placement", "bottom")
	    }

            const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
            const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
        }
    });
}

window.showMusicKits = () => {
    document.getElementById("skinsContainer").innerHTML = ""

    musicObject.forEach(element => {
        if (element.id.slice(-2) != "st") {
            let bgColor = "card-uncommon"
            let active = ""
            let steamid = user.id
            let music_id = element.id.slice(element.id.lastIndexOf("-") + 1)

            if (music_id == selectedMusicKit.music_id) {
                active = "active-card"
            }
            
            let card = document.createElement("div")
            card.classList.add("col-6", "col-sm-4", "col-md-3", "p-2")

            card.innerHTML = `
                <div onclick="changeMusic(\'${steamid}\', \'${music_id}\')" id="music-${music_id}" class="weapon-card card-rare rounded-3 d-flex flex-column ${active} ${bgColor} contrast-reset pb-2" data-type="skinCard" data-btn-type="" data-bs-title="${element.name.slice(12)}">
                    <div style="z-index: 3;" class="loading-card d-flex justify-content-center align-items-center w-100 h-100" id="loading-${music_id}">
                        <div class="spinner-border spinner-border-xl" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </div>

                    <img src="${element.image}" class="weapon-img mx-auto my-3" loading="lazy" width="181px" height="136px" alt=" ">
                    
                    <div class="d-flex align-items-center g-3">
                    
                    </div>
                    
                    <h5 class="weapon-skin-title text-roboto ms-3 pe-4" id="music-${music_id}-name">
                        ${element.name.slice(12)}
                    </h5>
                </div>
            `

            document.getElementById("skinsContainer").appendChild(card)

	    // Show full music kit name in tooltip if text overflows
	    let musicKit = document.getElementById(`music-${music_id}`)
	    let musicKitName = document.getElementById(`music-${music_id}-name`)

	    if (isEllipsisActive(musicKitName)) {
                musicKit.setAttribute("data-bs-toggle", "tooltip")
                musicKit.setAttribute("data-bs-placement", "bottom")
	    }

            const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
            const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
        }
    });

}
