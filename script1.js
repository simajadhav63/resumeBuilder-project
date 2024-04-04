
async function getJobs() {
	const location="India";
    const url = `https://indeed-jobs-api.p.rapidapi.com/indeed-us/?offset=0&keyword=python&location=${location}`;

    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'a6bb602e04msh39079aa1d39fb2ep1b78d8jsn3459b4845927',
            'X-RapidAPI-Host': 'indeed-jobs-api.p.rapidapi.com'
        }
    };
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Received data:', data); // Log the data received
        if (!data || !Array.isArray(data) || data.length === 0) {
            throw new Error('No jobs found or invalid response');
        }
        displayJobs(data);
    } catch (error) {
        console.error('Error fetching or displaying jobs:', error);
        const errorContainer = document.getElementById("error-container");
        errorContainer.textContent = "Error fetching or displaying jobs: " + error.message;
    }
}



function displayJobs(jobs) {
    const jobsContainer = document.getElementById("jobs-container");
    jobsContainer.innerHTML = ""; // Clear previous content

    if (!jobs || jobs.length === 0) {
        const noJobsMessage = document.createElement("p");
        noJobsMessage.textContent = "No jobs found";
        jobsContainer.appendChild(noJobsMessage);
        return;
    }

    jobs.forEach(job => {
        const jobElement = document.createElement("div");
        jobElement.classList.add("job");

        const titleElement = document.createElement("h2");
        titleElement.textContent = job.job_title || "Title not available";
        jobElement.appendChild(titleElement);

        const companyElement = document.createElement("p");
        companyElement.textContent = "Company: " + (job.company_name || "Company not available");
        jobElement.appendChild(companyElement);

        const locationElement = document.createElement("p");
        locationElement.textContent = "Location: " + (job.job_location || "Location not available");
        jobElement.appendChild(locationElement);

        // Add more job details if needed

        jobsContainer.appendChild(jobElement);
    });
}
document.addEventListener("DOMContentLoaded", getJobs);