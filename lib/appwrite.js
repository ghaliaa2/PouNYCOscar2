import { Account, Avatars, Client, Databases, ID, Query, Storage } from 'react-native-appwrite';

export const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.jsm.poonyc',
    projectId: '673fe65f00224f2a74e8',
    databaseId: '673fe7650001fcae835f',
    userCollectionId: '673fe77900202bf28c94',
    bathroomCollectionId: '673fe79b0019fde01ecd',
    storeageId: '67400f620031698e9dc3'
}

//Init your react-native SDK
const client = new Client();

client
    .setEndpoint(config.endpoint) //Your Appwrite Endpoint
    .setProject(config.projectId) //Your project ID
    .setPlatform(config.platform);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

// Add Bathroom
export const createBathroom = async (bathroomData) => {
    try {
        //Validate input
        const { bathroomName, rating, openHours, closeHours, isDisabilityFriendly, hasChangingStation, address, description, isSaved } = bathroomData;
        if (!bathroomName || !rating || !openHours || !closeHours || !address || !description) {
            throw new Error("Please fill in the required fields.")
        }

        // Create the bathroom document
        const newBathroom = await databases.createDocument(
            config.databaseId,
            config.bathroomCollectionId,
            ID.unique(),
            {
                bathroomName,
                rating: parseFloat(rating), //Ensure rating is stored as a number
                openHours,
                closeHours,
                isDisabilityFriendly,
                hasChangingStation,
                address,
                description,
                isSaved,
                createdAt: new Date().toISOString() //Add timestamp of bathroom addition date
            }
        );

        return newBathroom;
    } catch (error) {
        console.error("Error creating bathroom: ", error);
        throw new Error(error.message);
    }
}

// Create User
export const createUser = async (email, password, username) => {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        )

        if(!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(username);

        await signIn(email, password)

        const newUser = await databases.createDocument(
            config.databaseId,
            config.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email: email,
                username: username,
                avatar: avatarUrl
            }
        )

        return newUser;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

// Sign In
export const signIn = async (email, password) => {
    try {
        const session = await account.createEmailPasswordSession(email, password)
        return session;
    } catch (error) {
        throw new Error(error)
    }
}

// Get Account
export const getAccount = async () => {
    try {
        const currentAccount = await account.get();

        return currentAccount;
    } catch (error) {
        throw new Error(error);
    }
}

// Get Current User
export const getCurrentUser = async () => {
    try {
        const currentAccount = await getAccount();

        if(!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            config.databaseId,
            config.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        );

        if(!currentUser) throw Error;

        return currentUser.documents[0];
    } catch (error) {
        console.log(error);
        return null;
    }
}

// Sign Out
export const signOut = async () => {
    try {
        const session = await account.deleteSession("current");

        return session;
    } catch (error) {
        throw new Error(error);
    }
}