const axios = require("axios");

async function fetchPosts() {
    try {
        const response = await axios.get(
            "https://jsonplaceholder.typicode.com/posts?userId=3"
        );

        response.data.forEach(post => {
            console.log(post.title.toUpperCase());
        });

        console.log(`Total posts: ${response.data.length}`);

    } catch (error) {
        console.log("Error:", error.message);
    }
}

fetchPosts();

/*
Expected Output (sample):

EA MOLESTIAS QUASI EXERCITATIONEM REPELLAT QUI IPSA SIT AUT
ET IUSTO SED QUO IURE
...
Total posts: 10
*/