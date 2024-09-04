'use strict';
class VariantName {
    constructor(name, variantOptions) {
        this.name = name;
        this.variantOptions = variantOptions !== null && variantOptions !== void 0 ? variantOptions : [];
    }
    addVariantOption(variantOption) {
        var _a;
        if ((_a = this.variantOptions) === null || _a === void 0 ? void 0 : _a.length) {
            this.variantOptions.push(variantOption);
        } else {
            this.variantOptions = [variantOption];
        }
    }
}
class VariantOption {
    constructor(value, colorHex) {
        this.value = value;
        this.colorHex = colorHex;
    }
}
class ItemVariant {
    constructor(variantOptions, data) {
        this.name = data;
        this.variantOptions = variantOptions;
    }
}
/// List of all variantNames generated
const variantsList = [];
/// List of all variant name string
const varaintNames = variantsList.map((e) => e.name);
/// List of all variantOptions
const variantOptions = variantsList.map((e) => e.variantOptions).flat();
function addVariantName(name) {
    if (variantsList.find((e) => e.name.toLocaleLowerCase() === name.toLocaleLowerCase())) return false;
    variantsList.push(new VariantName(name));
    return true;
}
function addVariantOption(variantName, variantOption) {
    const variantObject = variantsList.find((e) => e.name.toLocaleLowerCase() === variantName.toLocaleLowerCase());
    if (!variantObject) {
        return false;
    }
    variantObject.addVariantOption(variantOption);
    return true;
}
/// recurse to create all variant option items
function createVariantOptions(variantOptions, index) {
    let variantOptionsList = [];
    if (index === variantsList.length - 1) {
        for (const variantOption of variantsList[index].variantOptions) {
            variantOptionsList.push([...variantOptions, variantOption]);
        }
    } else {
        for (const variantOption of variantsList[index].variantOptions) {
            variantOptionsList = [...variantOptionsList, ...createVariantOptions([...variantOptions, variantOption], index + 1)];
        }
    }
    return variantOptionsList;
}
/// test
addVariantName('Color');
addVariantName('Size');
addVariantName('MAX');
addVariantOption('Color', new VariantOption('Black'));
addVariantOption('Color', new VariantOption('Red'));
addVariantOption('Color', new VariantOption('Blue'));
addVariantOption('Size', new VariantOption('L'));
addVariantOption('Size', new VariantOption('M'));
addVariantOption('Size', new VariantOption('S'));
addVariantOption('MAX', new VariantOption('X'));
addVariantOption('MAX', new VariantOption('Y'));
addVariantOption('MAX', new VariantOption('Z'));
//// create all items
const itemVariants = createVariantOptions([], 0);
//// generate itemVariants
const itemVariantsObjects = [];
for (const combination of itemVariants) {
    itemVariantsObjects.push(new ItemVariant(combination));
}
/// extract needed data for variantOptionAttributes
const list = itemVariantsObjects.map((e) => ({ name: e.name, price: e.price }));
console.log(itemVariants.length);
console.log(itemVariants);
