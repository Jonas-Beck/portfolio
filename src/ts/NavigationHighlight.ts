// Get all sections
const sections: NodeListOf<HTMLElement> | null = document.querySelectorAll("section")

// Get all links 
const links: NodeListOf<HTMLElement> | null = document.querySelectorAll(".navbar a")

// Options for IntersectionObserver
// TODO Tweak Margin and Threshold for all sizes
const options: IntersectionObserverInit = {
    rootMargin: "0px 0px -40% 0px", // Add negative margin on bottom to focus on the section currently displayed near the top
    threshold: 0.6, // Number to indicate at what percentage of the targets visibility the observer's callback should be executed
}

// Call back function to handle when section intersect
const handleIntersect = (entries: IntersectionObserverEntry[]) => {
    // Loop all entries 
    entries.forEach(entry => {
        // Check if entry intersect
        if (entry.isIntersecting) {
            const currentSectionId = entry.target.id
            // call highlightCurrentSection with entry id to update classes
            highlightCurrentSection(currentSectionId)
        }
    });
}

// Function to handle updating the current highlight section
const highlightCurrentSection = (currentSectionId: string) => {
    links.forEach(link => {
        // Check if link href target match current sections id
        // If true add active class
        // Else remove active class
        link.getAttribute("href") === `#${currentSectionId}`  ? link.classList.add("text-2xl") : link.classList.remove("text-2xl")
    });
}

// Initialize the IntersectionObserver using handleIntersect as callback function and options for settings
const observer = new IntersectionObserver(handleIntersect, options)

// Loop all sections and tell observer to observe them 
sections.forEach((section) => {
    observer.observe(section)
})
