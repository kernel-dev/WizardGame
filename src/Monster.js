const ATTACKDAMAGE = {
    HIT: 5,
    FIRESPIT: 20,
    BITE: 8
};

Object.freeze(ATTACKDAMAGE);

module.exports.Monster = class {
    /**
     * 
     * @param {Game} game           The game runtime instance
     * @param {string} monsterType  The type of monster
     */
    constructor(game, monsterType) {
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
         * The monster's health.
         * 
         * @type number
         */
        this.health = 0;

        if (monsterType.toLowerCase() === "dragon")
            this.health = 300;
        else if (monsterType.toLowerCase() === "spider")
            this.health = 200;
        else
            throw new Error(
                `[MONSTER]: '${monsterType}' is an invalid monster!\n` + 
                `Available monsters: Dragon, Spider`
            );

        /**
         * The type of monster this is.
         * 
         * Possible monsters:
         *  - Dragon
         *  - Spider
         * 
         * @type string
         */
        this.type = monsterType;

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