import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyC1oRcJ7eAQaAO4kBqTJMt2w-ekoOCfj-I"; // Replace with your actual API key
const genAI = new GoogleGenerativeAI(API_KEY);

document.getElementById("projectRecommendationBtn").addEventListener("click", getProjectRecommendations);


async function getProjectRecommendations() {
    clearProjectRecommendations();
    const skills = getSkills();
    const projectRecommendations = await generateProjectRecommendations(skills);
    displayProjectRecommendations(projectRecommendations);
}
function clearProjectRecommendations() {
    const recommendationsContainer = document.querySelector(".project-recommendations");
    recommendationsContainer.innerHTML = ""; // Clear project recommendations
}

async function generateProjectRecommendations(skills) {
    showSpinner();
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const results = await Promise.all(skills.map(skill => model.generateContent(skill + " projects and github repos links")));
    const projectRecommendations = results.flatMap(result => {
        const response = result.response;
        return response.text().split("\n\n");
    });
    hideSpinner();
    return projectRecommendations;
}
function convertMarkdownToHtml(markdownText) {
    const md = window.markdownit();
    return md.render(markdownText);
}
// function displayProjectRecommendations(projectRecommendations) {
//     const recommendationsContainer = document.querySelector(".project-recommendations");
//     // recommendationsContainer.innerHTML = projectRecommendations.join("<br>");
//     recommendationsContainer.innerHTML = convertMarkdownToHtml(projectRecommendations.join("\n\n"));
//     projectRecommendations.forEach(recommendation => {
//         if (recommendation.includes("http")) {
//             // Create a new anchor element
//             const link = document.createElement("a");
//             link.href = recommendation;
//             link.textContent = recommendation;
//             link.target = "_blank"; // Open link in new tab
//             recommendationsContainer.appendChild(link);
//             recommendationsContainer.appendChild(document.createElement("br")); // Add line break
           
//         }
//     });
// }
function displayProjectRecommendations(projectRecommendations) {
    const recommendationsContainer = document.querySelector(".project-recommendations");
    const convertedHTML = convertMarkdownToHtml(projectRecommendations.join("\n\n"));
    recommendationsContainer.innerHTML = convertedHTML;

    // Select all anchor elements within the recommendations container
    const links = recommendationsContainer.querySelectorAll("a");

    // Loop through each anchor element
    links.forEach(link => {
        // Check if the anchor element's href attribute starts with "http"
        if (link.href && link.href.startsWith("http"))  {
            // Set the target attribute to "_blank" to open the link in a new tab
            link.target = "_blank";
        }
    });
}
function getSkills() {
    const skillsInputs = document.querySelectorAll(".skill");
    const skills = [];
    skillsInputs.forEach(input => {
        const skill = input.value.trim();
        if (skill) {
            skills.push(skill);
        }
    });
    return skills;
}
const spinnerContainer = document.querySelector('.spinner-container');
function showSpinner() {
    spinnerContainer.style.display = 'block';
}

function hideSpinner() {
    spinnerContainer.style.display = 'none';
}