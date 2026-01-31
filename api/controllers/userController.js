//this is named export function , it is better to use when there are multiple function to export
export const testApi = (req, res) => {
    res.json({message: "api is working"});
}

