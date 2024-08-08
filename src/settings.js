import { firestore, auth } from "./firebase";
import { collection, doc, getDoc } from "firebase/firestore";

let settings = {
    halfterm: undefined
};

async function loadSettings() {
    let unsubscribe = null;
    if (!auth.currentUser) {
        unsubscribe = auth.onAuthStateChanged(user => {
            console.log("Auth state changed, trying to load settings...");
            if (user) loadSettings();
            unsubscribe();
        });
        console.log("User not logged in, created callback")
        return;
    }

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
                else throw new Error("Customer object missing key: " + key);
            }
        } else throw new Error("Customer object not found");
    } catch (error) {
        console.error("Error loading settings:", error);
    }
}

// TODO: Implement, store to the db
function onSettingsChange(property, value) {
    console.log("Settings changed:", property, value);
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