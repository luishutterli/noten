import { firestore, app } from "./firebase";
import { getFunctions, httpsCallable } from "firebase/functions";
import { collection, addDoc, onSnapshot } from "firebase/firestore";

const createCustomerPortalLink = async (origin) => {
    try {
        const functions = getFunctions(app, "europe-west6");
        const createPortalLink = httpsCallable(functions, "ext-firestore-stripe-payments-createPortalLink");
        const { data } = await createPortalLink({
            returnUrl: origin,
            locale: "auto"
        });
        return data.url;
    } catch (error) {
        console.error("Error creating customer portal link", error);
        return null;
    }
};

const createSubscriptionCheckout = async (uid, price, origin) => {
    try {
        const docRef = await addDoc(collection(firestore, "customers", uid, "checkout_sessions"), {
            price: price,
            trial_period_days: 5,
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

export { createSubscriptionCheckout, createCustomerPortalLink };