import { firestore, auth } from "./firebase";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";

let settings = {
    halfterm: undefined
};

async function loadSettings() {
    const uid = auth.currentUser.uid;
    const docRef = doc(collection(firestore, "customers"), uid);

    try {
        console.log("Loading settings...");
        const doc = await getDoc(docRef);
        if (doc.exists()) {
            const data = doc.data();
            for (const key in settings) {
                if (data.hasOwnProperty(key))
                    settings[key] = data[key];
                else {
                    console.error("Customer object missing key:", key);
                    settings[key] = null;
                }
            }
        } else throw new Error("Customer object not found");
    } catch (error) {
        console.error("Error loading settings:", error);
    }
}

async function onSettingsChange(property, value) {
    console.log("Settings changed:", property, value);
    
    const uid = auth.currentUser.uid;
    const docRef = doc(collection(firestore, "customers"), uid);

    try {
        await updateDoc(docRef, {
            [property]: value
        });
   } catch (error) {
        console.error("Error saving settings:", error);
    }
}

const handler = {
    set(target, property, value) {
        target[property] = value;
        onSettingsChange(property, value);
        return true;
    }
}

const settingsProxy = new Proxy(settings, handler);

export { settingsProxy as settings, loadSettings };