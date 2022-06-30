const { Entity } = require("./Entity");

module.exports.Monster = class extends Entity {
    /**
     * 
     * @param {Game} game           The game runtime instance
     * @param {string} monsterType  The type of monster
     */
    constructor(game, monsterType) {
        if (monsterType.toLowerCase() === "dragon")
            super(300, monsterType);
        else if (monsterType.toLowerCase() === "spider")
            super(200, monsterType);
        else
            throw new Error(
                `[MONSTER]: '${monsterType}' is an invalid monster!\n` + 
                `Available monsters: Dragon, Spider`
            );

        /**
         * The game runtime.
         * 
         * This will be used internally to
         * update data such as attacks being executed.
         * 
         * @type Game
         */
         this.game = game;

        /**
         * The attacks this monster has.
         * 
         * Possible attacks:
         *  - Dragon: [ hit, firespit ]
         *  - Spider: [ hit, bite ]
         * 
         * @type string[]
         */
        this.attacks = [];

        if (this.type.toLowerCase() === "dragon")
            this.attacks = ["hit", "firespit"];
        else if (this.type.toLowerCase() === "spider")
            this.attacks = ["hit", "bite"];

        /**
         * Whether or not this monster is in a duel.
         * 
         * @type boolean
         */
        this.inDuel = false;
    }

    /**
     * Calculates the damage based
     * on the given attack for this monster.
     * 
     * @param {string} attack   The attack this monster will use.
     * @returns {number}    The damage
     */
    calculateDamage(attack) {
        return ATTACKDAMAGE[attack.toUpperCase()];
    }
}