import React from 'react';
import { Helmet } from 'react-helmet-async';

const CustomerSEO = () => {
    const keywords = "Infinity Web Technology, IT projects, business solutions, software marketplace, buy source code, ready-made projects, react projects, python projects, web applications, mobile apps, e-commerce solutions, business automation, startup projects, software for sale, digital products, tech marketplace, infinity projects, premium code, verified projects";

    const description = "Find premium, ready-made IT projects and software solutions at Infinity Web Technology. Perfect for businesses, startups, and entrepreneurs looking for high-quality, verified source code and applications. Instant download and support available.";

    return (
        <Helmet>
            <title>Customer Dashboard | Infinity Web Technology - Premium IT Projects Marketplace</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content="Customer Dashboard | Infinity Web Technology" />
            <meta property="og:description" content={description} />
            <meta property="og:image" content="/og-customer-zone.jpg" />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:title" content="Customer Dashboard | Infinity Web Technology" />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content="/og-customer-zone.jpg" />

            <meta name="topic" content="Business, Technology, Software Sales" />
            <meta name="target-audience" content="Businesses, Entrepreneurs, Startups" />
        </Helmet>
    );
};

export default CustomerSEO;
