import React, { useEffect, useRef, useState } from "react"

export interface Section {
    id: string
    name: string
}

interface NavigationProps {
    sections: Section[]
}

export const Navigation: React.FC<NavigationProps> = ({ sections }) => {
    // useState to keep track of current section being shown
    const [currentSectionId, setCurrentSectionId] = useState<string | null>(null)

    // ref for IntersectionObserver
    const observerRef = useRef<IntersectionObserver | null>(null)

    // Options for IntersectionObserver
    // TODO Tweak Margin and Threshold for all sizes
    const options: IntersectionObserverInit = {
        rootMargin: "0px 0px -75% 0px", // Add negative margin on bottom to focus on the section currently displayed near the top
        threshold: 1, // Number to indicate at what percentage of the targets visibility the observer's callback should be executed
    }

    // Call back function to handle when section intersect
    const handleIntersect: IntersectionObserverCallback = (entries: IntersectionObserverEntry[]) => {
        // Loop all entries
        entries.forEach((entry) => {
            // Check if entry intersect
            if (entry.isIntersecting) {
                setCurrentSectionId(entry.target.id)
            }
        })
    }

    // Setup the Intersection Observer when component is mounted
    useEffect(() => {
        // Initialize Intersection Observer
        observerRef.current = new IntersectionObserver(handleIntersect, options)

        // Loop all section and observe them
        sections.forEach((section) => {
            const element = document.getElementById(section.id)
            if (element) {
                observerRef.current?.observe(element)
            }
        })
    })

    return (
        <nav className="flex flex-col mt-16 navbar">
            {sections.map((section) => (
                <a
                    href={`#${section.id}`}
                    key={section.id}
                    className={`${section.id == currentSectionId ? "text-2xl transition-all font-bold" : "transition-all hover:text-2xl"}`}
                >
                    {section.name}
                </a>
            ))}
        </nav>
    )
}
