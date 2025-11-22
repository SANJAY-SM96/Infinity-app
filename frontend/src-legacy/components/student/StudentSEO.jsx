import React from 'react';
import { Helmet } from 'react-helmet-async';

const StudentSEO = () => {
    const keywords = "Infinity Web Technology, student projects, final year projects, computer science projects, engineering projects, project ideas, source code, project documentation, react projects, python projects, ai projects, machine learning projects, web development projects, android projects, iot projects, ieee projects, mini projects, major projects, capstone projects, thesis support, coding help, project mentorship, student developer community, infinity projects, buy projects, sell projects, monetize code";

    const description = "Explore the Student Project Zone at Infinity Web Technology - Your ultimate destination for final year projects, mini projects, and innovative coding ideas. Access verified source code, documentation, and expert mentorship. Buy ready-made projects or monetize your own work today.";

    return (
        <Helmet>
            <title>Student Project Zone | Infinity Web Technology - Final Year Projects & Mentorship</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content="Student Project Zone | Infinity" />
            <meta property="og:description" content={description} />
            <meta property="og:image" content="/og-student-zone.jpg" />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:title" content="Student Project Zone | Infinity" />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content="/og-student-zone.jpg" />

            {/* Hidden keywords for extra SEO juice (use sparingly and ethically) */}
            <meta name="topic" content="Education, Technology, Software Development" />
            <meta name="target-audience" content="Students, Developers, Researchers" />
        </Helmet>
    );
};

export default StudentSEO;
