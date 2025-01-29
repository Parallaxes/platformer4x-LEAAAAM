import LocalStorage from "./LocalStorage.js";
import GameEnv from "./GameEnv.js";
import GameControl from "./GameControl.js";
import Socket from "./Multiplayer.js";
import Chat from "./Chat.js";
import { enableLightMode, enableDarkMode } from './Document.js';

class SettingsControl extends LocalStorage {
    constructor() {
        const keys = {
            userID: "userID",
            currentLevel: "currentLevel",
            isInverted: "isInverted",
            gameSpeed: "gameSpeed",
            gravity: "gravity",
            difficulty: "difficulty",
            isLightMode: "isLightMode",
            funFact: "funFact"
        };
        super(keys);
        console.log("SettingsControl constructor called");
    }

    initialize() {
        console.log("Initializing SettingsControl");
        this.loadAll();
    
        const handleKey = (key, gameEnvVariable, parser = (val) => val) => {
            if (this[this.keys[key]]) {
                return parser(this[this.keys[key]]);
            } else {
                this[this.keys[key]] = gameEnvVariable;
                return gameEnvVariable;
            }
        };
    
        GameEnv.userID = handleKey('userID', GameEnv.userID);
        GameEnv.currentLevel = handleKey('currentLevel', GameEnv.levels[Number(this[this.keys.currentLevel])]);
        GameEnv.isInverted = handleKey('isInverted', GameEnv.isInverted, (val) => val === "true");
        GameEnv.gameSpeed = handleKey('gameSpeed', GameEnv.gameSpeed, parseFloat);
        GameEnv.gravity = handleKey('gravity', GameEnv.gravity, parseFloat);
        GameEnv.difficulty = handleKey('difficulty', GameEnv.difficulty);
        GameEnv.isLightMode = handleKey('isLightMode', GameEnv.isLightMode, (val) => val === "true");
        GameEnv.funFact = handleKey('funFact', GameEnv.funFact, (val) => val === "true");
    
        this.applySettings();
    
        window.addEventListener("difficulty", (e) => {
            console.log("Difficulty changed:", e.detail.difficulty());
            this[this.keys.difficulty] = e.detail.difficulty();
            GameEnv.difficulty = this[this.keys.difficulty];
            this.save(this.keys.difficulty);
            this.reloadGame();
        });
        window.addEventListener("userID", (e) => {
            console.log("UserID changed:", e.detail.userID());
            this[this.keys.userID] = e.detail.userID();
            GameEnv.userID = this[this.keys.userID];
            Socket.sendData("name", GameEnv.userID);
            this.save(this.keys.userID);
        });
        window.addEventListener("resize", () => {
            console.log("Window resized");
            this[this.keys.currentLevel] = GameEnv.levels.indexOf(GameEnv.currentLevel);
            this.save(this.keys.currentLevel);
        });
        window.addEventListener("isInverted", (e) => {
            console.log("Inverted changed:", e.detail.isInverted());
            this[this.keys.isInverted] = e.detail.isInverted();
            GameEnv.isInverted = this[this.keys.isInverted];
            this.save(this.keys.isInverted);
        });
        window.addEventListener("gameSpeed", (e) => {
            console.log("GameSpeed changed:", e.detail.gameSpeed());
            this[this.keys.gameSpeed] = e.detail.gameSpeed();
            GameEnv.gameSpeed = parseFloat(this[this.keys.gameSpeed]);
            this.save(this.keys.gameSpeed);
        });
        window.addEventListener("gravity", (e) => {
            console.log("Gravity changed:", e.detail.gravity());
            this[this.keys.gravity] = e.detail.gravity();
            GameEnv.gravity = parseFloat(this[this.keys.gravity]);
            this.save(this.keys.gravity);
        });
        window.addEventListener("isLightMode", (e) => {
            console.log("LightMode changed:", e.detail.isLightMode());
            this[this.keys.isLightMode] = e.detail.isLightMode();
            GameEnv.isLightMode = this[this.keys.isLightMode];
            this.save(this.keys.isLightMode);
            this.applyTheme();
        });
        window.addEventListener("funFact", (e) => {
            console.log("FunFact changed:", e.detail.funFact());
            this[this.keys.funFact] = e.detail.funFact();
            GameEnv.funFact = this[this.keys.funFact];
            this.save(this.keys.funFact);
        });

        // Add event listener to settings button
        const settingsButton = document.getElementById("settings-button");
if (settingsButton) {
    console.log("Settings button found");
    settingsButton.addEventListener("click", () => {
        console.log("Settings button clicked");
        const sidebar = document.getElementById("sidebar");
        if (sidebar) {
            console.log("Sidebar found");

            // New Line: Initialize width if it hasn't been set yet
            sidebar.style.width = sidebar.style.width || "0";

            console.log("Current sidebar width:", sidebar.style.width);
            const isShown = sidebar.style.width === "250px";
            sidebar.style.width = isShown ? "0" : "250px";
            console.log("Sidebar toggled, new width:", sidebar.style.width);
        } else {
            console.error("Sidebar element not found");
        }

    });

    } else {
        console.error("Settings button not found");
    }

}

    applySettings() {
        console.log("Applying settings");
        this.applyTheme();
        // Apply other settings as needed
    }

    applyTheme() {
        console.log("Applying theme");
        if (GameEnv.isLightMode) {
            enableLightMode();
        } else {
            enableDarkMode();
        }
    }

    createSidebar() {
        console.log("Creating sidebar");
        const sidebar = document.getElementById("sidebar");
        if (!sidebar) {
            console.error("Sidebar element not found");
            return;
        }
        sidebar.append(this.levelTable());
        sidebar.append(this.userIDInput());
        sidebar.append(this.gameSpeedInput());
        sidebar.append(this.gravityInput());
        sidebar.append(this.difficultyInput());
        sidebar.append(this.isInvertedInput());
        sidebar.append(this.isThemeInput());
        sidebar.append(this.funFactInput());
        sidebar.append(this.multiplayerButton());
        sidebar.append(this.chatButton());
    }

    levelTable() {
        console.log("Creating level table");
        const table = document.createElement("table");
        table.className = "table levels";
        const header = document.createElement("tr");
        const th1 = document.createElement("th");
        th1.innerText = "#";
        header.append(th1);
        const th2 = document.createElement("th");
        th2.innerText = "Level Tag";
        header.append(th2);
        table.append(header);

        for (let i = 0, count = 1; i < GameEnv.levels.length; i++) {
            if (GameEnv.levels[i].passive) continue;
            const row = document.createElement("tr");
            const td1 = document.createElement("td");
            td1.innerText = String(count++);
            row.append(td1);
            const td2 = document.createElement("td");
            td2.innerText = GameEnv.levels[i].tag;
            row.append(td2);
            row.addEventListener("click", () => {
                console.log("Transitioning to level:", GameEnv.levels[i].tag);
                GameControl.transitionToLevel(GameEnv.levels[i]);
            });
            table.append(row);
        }

        return table;
    }

    userIDInput() {
        console.log("Creating user ID input");
        const div = document.createElement("div");
        div.innerHTML = "User ID: ";
        const userID = document.createElement("input");
        userID.type = "text";
        userID.value = GameEnv.userID;
        userID.maxLength = 10;
        userID.className = "input userID";

        userID.addEventListener("change", () => {
            console.log("User ID changed:", userID.value);
            window.dispatchEvent(new CustomEvent("userID", { detail: { userID: () => userID.value } }));
        });

        div.append(userID);
        return div;
    }

    gameSpeedInput() {
        console.log("Creating game speed input");
        const div = document.createElement("div");
        div.innerHTML = "Game Speed: ";
        const gameSpeed = document.createElement("input");
        gameSpeed.type = "number";
        gameSpeed.min = 1.0;
        gameSpeed.max = 8.0;
        gameSpeed.step = 0.1;
        gameSpeed.default = 2.0;
        gameSpeed.value = GameEnv.gameSpeed;
        gameSpeed.className = "input gameSpeed";

        gameSpeed.addEventListener("change", () => {
            const value = parseFloat(gameSpeed.value).toFixed(1);
            gameSpeed.value = (value < gameSpeed.min || value > gameSpeed.max || isNaN(value)) ? gameSpeed.default : value;
            console.log("Game speed changed:", gameSpeed.value);
            window.dispatchEvent(new CustomEvent("gameSpeed", { detail: { gameSpeed: () => gameSpeed.value } }));
        });

        div.append(gameSpeed);
        return div;
    }

    gravityInput() {
        console.log("Creating gravity input");
        const div = document.createElement("div");
        div.innerHTML = "Gravity: ";
        const gravity = document.createElement("input");
        gravity.type = "number";
        gravity.min = 1.0;
        gravity.max = 8.0;
        gravity.step = 0.1;
        gravity.default = 3.0;
        gravity.value = GameEnv.gravity;
        gravity.className = "input gravity";

        gravity.addEventListener("change", () => {
            const value = parseFloat(gravity.value).toFixed(1);
            gravity.value = (value < gravity.min || value > gravity.max || isNaN(value)) ? gravity.default : value;
            console.log("Gravity changed:", gravity.value);
            window.dispatchEvent(new CustomEvent("gravity", { detail: { gravity: () => gravity.value } }));
        });

        div.append(gravity);
        return div;
    }

    difficultyInput() {
        console.log("Creating difficulty input");
        const div = document.createElement("div");
        div.innerHTML = "Difficulty: ";
        const difficulty = document.createElement("select");
        const options = ["Easy", "Normal", "Hard", "Impossible"];

        options.forEach(option => {
            const opt = document.createElement("option");
            opt.value = option.toLowerCase();
            opt.text = option;
            difficulty.add(opt);
        });

        difficulty.value = GameEnv.difficulty;

        difficulty.addEventListener("change", () => {
            console.log("Difficulty changed:", difficulty.value);
            window.dispatchEvent(new CustomEvent("difficulty", { detail: { difficulty: () => difficulty.value } }));
        });

        div.append(difficulty);
        return div;
    }

    isInvertedInput() {
        console.log("Creating inverted input");
        const div = document.createElement("div");
        div.innerHTML = "Invert: ";
        const isInverted = document.createElement("input");
        isInverted.type = "checkbox";
        isInverted.checked = GameEnv.isInverted;

        isInverted.addEventListener("change", () => {
            console.log("Inverted changed:", isInverted.checked);
            window.dispatchEvent(new CustomEvent("isInverted", { detail: { isInverted: () => isInverted.checked } }));
        });

        div.append(isInverted);
        return div;
    }

    isThemeInput() {
        console.log("Creating theme input");
        const div = document.createElement("div");
        div.innerHTML = "Theme Change: ";
        const isLightMode = document.createElement("input");
        isLightMode.type = "checkbox";
        isLightMode.checked = GameEnv.isLightMode;

        isLightMode.addEventListener("change", () => {
            console.log("Theme changed:", isLightMode.checked);
            window.dispatchEvent(new CustomEvent("isLightMode", { detail: { isLightMode: () => isLightMode.checked } }));
        });

        div.append(isLightMode);
        return div;
    }

    funFactInput() {
        console.log("Creating fun fact input");
        const div = document.createElement("div");
        div.innerHTML = "Show Hints: ";
        const funFact = document.createElement("input");
        funFact.type = "checkbox";
        funFact.checked = GameEnv.funFact;

        funFact.addEventListener("change", () => {
            console.log("Fun fact changed:", funFact.checked);
            window.dispatchEvent(new CustomEvent("funFact", { detail: { funFact: () => funFact.checked } }));
        });

        div.append(funFact);
        return div;
    }

    multiplayerButton() {
        console.log("Creating multiplayer button");
        const div = document.createElement("div");
        div.innerHTML = "Multiplayer: ";
        const button = document.createElement("button");
        button.innerText = String(Socket.shouldBeSynced);

        button.addEventListener("click", () => {
            button.innerText = String(Socket.changeStatus());
            console.log("Multiplayer status changed:", button.innerText);
        });

        div.append(button);
        return div;
    }

    chatButton() {
        console.log("Creating chat button");
        const div = document.createElement("div");
        div.innerHTML = "Chat: ";
        const button = document.createElement("button");
        button.innerText = "open";

        const chatClass = new Chat([]);
        const chatBoxContainer = chatClass.chatBoxContainer;
        chatBoxContainer.style.display = "none";

        button.addEventListener("click", () => {
            const isShown = chatBoxContainer.style.display === "block";
            chatBoxContainer.style.display = isShown ? "none" : "block";
            button.innerText = isShown ? "open" : "close";
            console.log("Chat button clicked, chat box is now:", button.innerText);
        });

        div.append(button);
        return div;
    }

    reloadGame() {
        console.log("Reloading game");
        window.location.reload();
    }
}

export default SettingsControl;