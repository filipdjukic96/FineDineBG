import {MenuItem} from './menuitem.model';

export interface Menu{
    //bez imena restorana, jer treba da se ucita kao JSON
    appetizers: Array<MenuItem>,
    mains: Array<MenuItem>,
    desserts: Array<MenuItem>,
    salads: Array<MenuItem>,
    soups: Array<MenuItem>,
    nonalcoholic: Array<MenuItem>,
    alcoholic: Array<MenuItem>,
    wines: Array<MenuItem>,
}