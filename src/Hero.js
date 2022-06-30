const { Entity } = require("./Entity");

// Enum for weapons allowed
// for each hero.
const HEROWEAPONS = {
    KNIGHT: ["sword", "javelin"],
    WIZARD: ["sorcery"]
}

// Preserve values inside of HEROWEAPONS
// by freezing the object, disallowing
// the addition and removal of properties.
Object.freeze(HEROWEAPONS);

module.exports.Hero = class extends Entity {
    /**
     * 
     * @param {Game} game           The game runtime instance
     * @param {string} heroType     The type of hero
     */
    constructor(game, heroType) {
        /**
         * The hero's health.
         * 
         * @type number
         */
        if (heroType.toLowerCase() === "knight")
            super(100, heroType);
        else if (heroType.toLowerCase() === "wizard")
            super(150, heroType);
        else
            throw new Error(
                `[HERO]: '${heroType}' is an invalid hero!\n` + 
                `Available heroes: Wizard, Knight`
            );
            
        /**
         * The game runtime.
         * 
         * This will be used to update data
         * such as available weapons.
         * 
         * @type Game
         */
        this.game = game


        /**
         * The weapons this hero has.
         * 
         * The length of this array
         * can never exceed 2 entries.
         * 
         * @type string[]
         */
        this.weapons = [];

        /**
         * The weapon this hero has equipped.
         * 
         * @type string
         */
        this.equipped = null;

        /**
         * Whether or not this hero is in a duel.
         * 
         * @type boolean
         */
        this.inDuel = false;
    }

    /**
     * Equips a weapon into a hero's backpack,
     * if the weapon can be equipped by the current hero.
     * 
     * @param {string} weapon   The weapon to equip, if applicable.
     */
    equipWeapon(weapon) {
        this.validateWeapon(weapon);

        if (this.weapons.length === 2)
            throw new Error(`[EQUIP]: Cannot equip more than 2 weapons at a time!`);

        this.weapons.push(weapon.toLowerCase());
        this.equipped = weapon.toLowerCase();
    }

    /**
     * Switches out the weapon in-hand
     * to one from the hero's “backpack”
     * 
     * If there is not another weapon in
     * the backpack, an exception will be thrown.
     */
    switchWeapon() {
        if (this.weapons.length < 1)
            throw new Error("[SWITCH]: No weapons available at all!")
        if (
            this.weapons.length === 1 &&
            this.equipped.toLowerCase() === this.weapons?.[0].toLowerCase()
        )
            throw new Error("[SWITCH]: Can't switch to the only weapon available that's already in-hand!");
        
        this.equipped = this.weapons.filter(x => x.toLowerCase() != this.equipped.toLowerCase())?.[0];
    }

    /**
     * Drops the specified weapon
     * if found in the hero's inventory,
     * or the one equipped in-hand if none
     * was explicitly specified.
     * 
     * @param {string?} weapon  The weapon to drop, if possible -
     *                          no need to specify this parameter if
     *                          the weapon in-hand should be dropped.
     */
    dropWeapon(weapon = this.equipped) {
        if (weapon === this.equipped && !this.equipped)
            throw new Error("[DROP]: No weapon equipped at all!");

        if (weapon !== this.equipped && !this.weapons.includes(weapon))
            throw new Error("[DROP]: Selected weapon does not exist in this hero's inventory!");

        this.weapons.splice(
            this.weapons.indexOf(weapon.toLowerCase()),
            1
        );

        this.game.equipDropped(weapon.toLowerCase());
    }

    /**
     * Ensures that a hero can only equip their
     * respective weapon; a wizard can't equip a sword nor javelin,
     * and a knight can't learn sorcery.
     * 
     * Available weapons:
     * - Sword
     * - Javelin
     * - Sorcery
     * 
     * @param {string} weapon   The weapon to validate.
     * @returns {boolean}
     */
    validateWeapon(weapon) {
        if (this.weapons.includes(weapon.toLowerCase())) return false;

        const allWeapons      = [].concat(...Object.values(HEROWEAPONS));
        const knightWeapons   = HEROWEAPONS.KNIGHT;
        const wizardWeapons   = HEROWEAPONS.WIZARD;

        if (!allWeapons.includes(weapon.toLowerCase())) {
            throw new Error(
                `[WEAPONS]: '${weapon}' is an invalid weapon!\n` +
                `Available weapons: ${this.formatWeaponsList(allWeapons).join(", ")}`
            );
        }

        const type = this.type.toLowerCase();

        if (type === "wizard" && knightWeapons.includes(weapon.toLowerCase()))
            throw new Error(
                `[WEAPONS]: A wizard cannot equip '${weapon}'!\n` +
                `Available weapons for a wizard: ${this.formatWeaponsList(wizardWeapons).join(", ")}`
            );
        
        else if (type === "knight" && wizardWeapons.includes(weapon.toLowerCase()))
            throw new Error(
                `[WEAPONS]: A knight cannot learn '${weapon}'!\n` + 
                `Available weapons for a knight: ${this.formatWeaponsList(knightWeapons).join(", ")}`
            );
    }

    /**
     * Properly formats all the entries
     * in the weapons list.
     * 
     * Example: `xyz` -> `Xyz` 
     * 
     * @param {string[]} weapons    The weapons list
     * @returns {string[]}
     */
    formatWeaponsList(weapons) {
        if (!Array.isArray(weapons)) return weapons;

        return weapons.map(x => x[0].toUpperCase() + x.slice(1).toLowerCase());
    }
}