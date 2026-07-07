import {collection, getDocs} from "firebase/firestore";
import {db} from "../firebase/config";
import type {RPG} from "../models/RPG";

export async function getRPGs(): Promise<RPG[]> {
    const querySnapshot = await getDocs(collection(db, "rpgs"));
    const rpgs: RPG[] = querySnapshot.docs.map((doc) => ({
        id: doc.data().id,
        ...doc.data(),
    })) as RPG[];
    return rpgs;
    }
