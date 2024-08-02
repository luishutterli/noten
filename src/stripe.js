import { firestore } from "./firebase";
import { collection, addDoc, onSnapshot } from "firebase/firestore";


const createSubscriptionCheckout = async (uid, price, origin) => {
    try {
        const docRef = await addDoc(collection(firestore, "customers", uid, "checkout_sessions"), {
            price: price,
            trial_period_days: 7,
            allow_promotion_codes: true,
            collect_shipping_address: false,
            success_url: origin,
            cancel_url: origin,
        });

        return new Promise((resolve, reject) => {
            onSnapshot(docRef, (snapshot) => {
                const { error, url } = snapshot.data();
                if (error) {
                    reject(new Error(`An error occurred: ${error.message}`));
                }
                if (url) {
                    resolve(url);
                }
            });
        });
    } catch (error) {
        console.error("Error creating subscription checkout", error);
        return null;
    }
};

export { createSubscriptionCheckout };