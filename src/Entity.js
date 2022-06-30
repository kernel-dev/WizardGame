module.exports.Entity = class {
    constructor(health, type) {
        this.health = health;

        this.type = type;

        this.ATTACKS = {
            SWORD: 10,
            JAVELIN: 15,
            SORCERY: 20,
            HIT: 5,
            FIRESPIT: 20,
            BITE: 8
        };

        // Retain immutability for object.
        Object.freeze(this.ATTACKS);
    }

    /**
     * Attacks an enemy with the
     * provided attack.
     * 
     * @param {Entity} enemy    The enemy to attack.
     * @param {string} attack   The attack to use.
     */
    attack(enemy, attack) {
        enemy.health -= this.getDamage(attack);
    }

    /**
     * Calculates the damage of
     * a given attack.
     * 
     * @param {string} attack   The attack to calculate the damage of.
     * @returns {number}        The damage of this attack.
     */
    getDamage(attack) {
        return this.ATTACKS[attack.toUpperCase()];
    }
}