const admin = require('firebase-admin');

const serviceAccount = require('./firebase-adminsdk.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const groupings = [    
    {
        "name": "Promotionsfächer",
        "members": [
            "1ZcA00XGTPBG4y2porsT",
            "8fq4n1IliqwBiAlnEQBx",
            "IciA0sAKpfGCSuncok3q",
            "MGlo6mqsd57GezIlf6D3"
        ]
    },
    {
        "name": "Schwerpunkfächer",
        "members": [
            "POTKHqUZDuh1n1xmhjiS",
            "zhnL2uCXRIxhvu8eHkKl"
        ]
    },
    {
        "name": "Ergänzungsbereich",
        "members": [
            "OWAyXIrPYodSwvrSvca2",
            "8X5QtjKTpTVuObBWORTX"
        ]
    },
    {
        "name": "EFZ-Fächer",
        "members": [
            "DmVecnQCks3YFqFUVLlh",
            "OPfVz3Er7FYjE9MSCgxp",
            "trJsE39hUYyrrdCdK80B",
            "MXhCC6ScDtyBaK9yNFOS"
        ]
    }
];

const docRef = db.collection('subjects').doc('41NufU4OXdORknTWj5LN');

docRef.update({ groupings })
    .then(() => {
        console.log("Groupings added successfully");
    }).catch((error) => {
        console.error("Error adding groupings: ", error);
    }
);