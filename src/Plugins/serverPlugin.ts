
const GRAPHQL_URL = import.meta.env.VITE_GRAPHQL_API_URL;

export default async function serverPlugin(url: string, requestType: string) {
    console.log(import.meta.env);
    if (!GRAPHQL_URL) {
        throw new Error("VITE_GRAPHQL_API_URL is not defined in .env");
    }

    try {
        const response = await fetch(`${GRAPHQL_URL}/schema?url=${encodeURIComponent(url)}`, {
            method: requestType,
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(data.typeDefs);
        
        return data.typeDefs;
    } catch (err) {
        console.error("Error in serverPlugin:", err);
    }
}
