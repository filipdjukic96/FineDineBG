
import { FavoriteItem } from './favoriteitem.model';

export interface UserFavorites{
    username:String,
    favorites: Array<FavoriteItem>
}