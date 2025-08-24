document.getElementById('prompt-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const prompt = document.getElementById('prompt-input').value;
    const imageContainer = document.getElementById('image-container');
    imageContainer.innerHTML = '<p>Generating description...</p>';

    try {
        const response = await fetch('http://localhost:3000/generate-image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: prompt }),
        });

        const data = await response.json();

        if (response.ok) {
            // Correctly access the 'description' key from the server response
            const description = data.description;
            
            // Display the description as text instead of trying to create an image
            imageContainer.innerHTML = `<p><strong>Description:</strong> ${description}</p>`;
        } else {
            imageContainer.innerHTML = `<p style="color: red;">Error: ${data.error}</p>`;
        }
    } catch (error) {
        console.error('Fetch error:', error);
        imageContainer.innerHTML = `<p style="color: red;">An error occurred. Check the server console.</p>`;
    }
});