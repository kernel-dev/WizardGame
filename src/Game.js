const fs = require("fs");
const { Hero } = require("./Hero");
const { Monster } = require("./Monster");

module.exports.Game = class {
    constructor() {
        /**
         * The available weapons for heroes
         * to pick up.
         * 
         * @type string[]
         */
        this.weapons = [
            "sword",
            "sword",
            "sword",
            "javelin",
            "javelin",
            "javelin",
            "sorcery",
            "sorcery"
        ];

        /**
         * The heroes in this game.
         * 
         * @type Hero[]
         */
        this.heroes = [
            new Hero(this, "wizard"),
            new Hero(this, "wizard"),
            new Hero(this, "knight"),
            new Hero(this, "knight"),
            new Hero(this, "knight")
        ];

        /**
         * The monsters in this game.
         * 
         * @type Monster[]
         */
        this.monsters = [
            new Monster(this, "dragon"),
            new Monster(this, "dragon"),
            new Monster(this, "spider"),
            new Monster(this, "spider"),
            new Monster(this, "spider"),
        ];

        this.createLog();
    }

    /**
     * Starts the game.
     */
    start() {
        for (const hero of this.heroes) {
            for (const [i, weapon] of this.weapons.entries()) {
                try {
                    if (hero.equipWeapon(weapon))
                        continue;

                    this.weapons.splice(i, 1);
                } catch {}
            }

            // This should never happen.
            if (!hero.weapons.length) 
                console.error("[EQ]: Unable to equip hero with any weapons - critical.");
        }

        this.startDuel();
        this.testDrop();
    }

    /**
     * Equips a recently dropped weapon
     * to a random hero that can equip it.
     * 
     * @param {string} weapon  The weapon to equip to a random hero.
     */
    equipDropped(weapon) {
        let successful = false;
        
        for (const hero of this.heroes) {
            try {
                hero.equipWeapon(weapon);
                
                fs.appendFileSync(
                    "log.txt",
                    `${hero.type} equipped themselves with ${weapon}!`
                )

                successful = true;
                break;
            } catch {};
        }

        if (!successful) 
            console.error("[EQUIP]: Unable to equip dropped weapon to hero.");
    }

    /**
     * "Unit test" to see if
     * `Game#equipDropped()` works properly.
     */
    testDrop() {
        const heroes = this.heroes.filter(hero => hero.weapons.length);
        const hero = heroes[Math.floor(Math.random() * heroes.length)];

        hero.dropWeapon();
    }

    /**
     * Puts a random monster and a random hero
     * into a duel.
     * 
     * This will exclude heroes without weapons -
     * because that just isn't a fair fight now, is it?
     */
    startDuel() {
        const heroes = this.heroes.filter(hero => hero.weapons.length > 0 && !hero.inDuel);
        if (!heroes.length) return;

        const hero = heroes[Math.floor(Math.random() * heroes.length)];

        const monsters = this.monsters.filter(monster => !monster.inDuel);
        if (!monsters.length) return;

        const monster = monsters[Math.floor(Math.random() * monsters.length)];

        if (!hero.equipped)
            hero.equipped = hero.weapons[0];

        hero.inDuel = true;
        monster.inDuel = true;

        while (hero.health > 0 && monster.health > 0) {
            const rand = Math.floor(Math.random() * 101);

            if (rand < 50) {
                fs.appendFileSync(
                    "log.txt",
                    `${hero.type} has attacked ${monster.type} using ${hero.equipped}!\n`
                );

                monster.health -= hero.damage;
            }
            else {
                const attack = monster.attacks[Math.floor(Math.random() * 2)];

                fs.appendFileSync(
                    "log.txt",
                    `${monster.type} has attacked ${hero.type} using ${attack}!\n`
                );

                hero.health -= monster.calculateDamage(attack);
            }
        }

        hero.inDuel = false;
        monster.inDuel = false;

        const winner = hero.health <= 0 ? monster : hero;
        const loser  = hero.health <= 0 ? hero : monster;

        this.heroes = this.heroes.filter(hero => hero.health);
        this.monsters = this.monsters.filter(monster => monster.health);

        const log = `The ${winner.type} is the winner of this duel against the ${loser.type}\n`;
        
        console.log(log);

        fs.appendFileSync("log.txt", log);
    }

    /**
     * Creates a file to hold runtime logs.
     */
    createLog() {
        fs.writeFileSync("log.txt", "");

        console.log("[DEBUG]: Successfully created log!");
    }
}