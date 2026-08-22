import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const BASE_URL = 'https://amdehaymanot.com';
const DEFAULT_IMAGE = `${BASE_URL}/my-logo.png`;

export default function SEO({ 
  title, 
  description, 
  image = DEFAULT_IMAGE, 
  language = 'am', 
  type = 'website' 
}) {
  const location = useLocation();
  const currentUrl = `${BASE_URL}${location.pathname}`;

  return (
    <Helmet>
      {/* Standard Metadata */}
      <html lang={language} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={currentUrl} />

      {/* Open Graph / Facebook / WhatsApp */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="ዓምደ ሃይማኖት ሰንበት ትምህርት ቤት" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}
