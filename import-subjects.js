const admin = require("firebase-admin");
const fs = require("node:fs");
const path = require("node:path");

function loadJsonFromFile(filePath) {
    try {
        console.log("Trying to load JSON file:", filePath);
        const absolutePath = path.resolve(filePath);
        console.log("Absolute path of JSON:", absolutePath);
        const rawData = fs.readFileSync(absolutePath, "utf8");
        console.log("File loaded. Parsing JSON...");
        return JSON.parse(rawData);
    } catch (error) {
        console.error("Error loading JSON file:", error);
        process.exit(1);
    }
}

const serviceAccount = require("./firebase-adminsdk.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const idMap = new Map();

function getGroupDepth(item, subjectsData, visited = new Set()) {
    if (visited.has(item._tempId)) {
        throw new Error(`Circular dependency detected for group: ${item.name}`);
    }

    if (item.type === "subject") {
        return 0;
    }

    visited.add(item._tempId);

    const memberDepths = item.members.map((memberId) => {
        const memberItem = subjectsData.find((s) => s._tempId === memberId);
        if (!memberItem) {
            throw new Error(`Member with ID ${memberId} not found for group ${item.name}`);
        }
        return getGroupDepth(memberItem, subjectsData, new Set(visited));
    });

    visited.delete(item._tempId);

    return Math.max(0, ...memberDepths) + 1;
}

function sortGroupsByDependency(groups, subjectsData) {
    return [...groups].sort((a, b) => {
        const depthA = getGroupDepth(a, subjectsData);
        const depthB = getGroupDepth(b, subjectsData);
        return depthB - depthA;
    }).reverse();
}

async function importSubjects(subjectsData) {
    console.log("Starting import...");
    try {
        console.log("Adding subjects...");
        const subjects = subjectsData.filter((item) => item.type === "subject");
        for (const subject of subjects) {
            const { _tempId, ...subjectData } = subject;
            const docRef = await db.collection("subjects").add(subjectData);
            idMap.set(_tempId, docRef.id);
            console.log(`Added subject: ${subject.name} with ID: ${docRef.id}`);
        }

        const groupsAndHalfterms = subjectsData.filter((item) => item.type === "group" || item.type === "halfterm");

        console.log("\nAnalyzing group dependencies...");
        const sortedGroups = sortGroupsByDependency(groupsAndHalfterms, subjectsData);

        // console.log("\nSorted groups by dependency depth:\n", sortedGroups);

        console.log("\nAdding groups and halfterms in dependency order...");
        for (const item of sortedGroups) {
            const { _tempId, members, ...itemData } = item;

            const missingMembers = members.filter((memberId) => !idMap.has(memberId));
            if (missingMembers.length > 0) {
                throw new Error(
                    `Cannot create ${item.type} "${item.name}": Missing Firestore IDs for members: ${missingMembers.join(", ")}`,
                );
            }

            const updatedMembers = members.map((tempId) => idMap.get(tempId));
            const docRef = await db.collection("subjects").add({
                ...itemData,
                members: updatedMembers,
            });

            idMap.set(_tempId, docRef.id);
            console.log(`Added ${item.type}: ${item.name} with ID: ${docRef.id}`);
        }

        console.log("\nImport completed successfully!");

        console.log("\nID Mappings:");
        for (const [tempId, firestoreId] of idMap) {
            console.log(`${tempId} => ${firestoreId}`);
        }
    } catch (error) {
        console.error("Error importing subjects:", error);

        console.log("Rolling back changes...");
        for (const [tempId, firestoreId] of idMap) {
            console.log(`Deleting document with ID: ${firestoreId}`);
            await db.collection("subjects").doc(firestoreId).delete();
        }
    } finally {
        process.exit(0);
    }
}

if (process.argv.length < 3) {
    console.error("Please provide the path to your JSON file");
    console.error("Usage: node script.js <path-to-json-file>");
    process.exit(1);
}

const jsonFilePath = process.argv[2];
const subjectsData = loadJsonFromFile(jsonFilePath);
console.log("Subjects data loaded successfully!");
importSubjects(subjectsData);
