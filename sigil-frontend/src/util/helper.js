
export const getImageUrl = (imagePath) => {
    if (!imagePath) return null;

    if(imagePath.startsWith('/public')){
        return imagePath;
    }

    const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
    return `${baseUrl}/storage/${imagePath}`;
}

export const getPlainTextFromLexical = (jsonString) => {
    try {
        const root = JSON.parse(jsonString).root;
        let text = "";

        const traverse = (node) => {
            if (node.text) text += node.text;
            if (node.children) node.children.forEach(traverse);
        };

        traverse(root);
        return text;
    }catch(error){
        return jsonString;
    }
}

export const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

export const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];


export const formatArchiveDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
}