const axios = require('axios');
const cheerio = require('cheerio');

exports.checkMeta = async (req, res) => {
    try {
        const { apiKey, url } = req.body;

        // 1. Validate API Key
        if (!apiKey || apiKey !== 'dontGoCrazy') {
            return res.status(401).json({
                success: false,
                message: 'Invalid or missing API Key'
            });
        }

        // 2. Validate URL
        if (!url) {
            return res.status(400).json({
                success: false,
                message: 'URL is required'
            });
        }

        // Basic URL format validation
        let validUrl;
        try {
            validUrl = new URL(url);
        } catch (e) {
            return res.status(400).json({
                success: false,
                message: 'Invalid URL format'
            });
        }

        // 3. Fetch HTML
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'MetaChecker/1.0'
            },
            timeout: 10000
        });

        const html = response.data;
        const $ = cheerio.load(html);

        // 4. Extract Meta Data
        const title = $('title').text() || $('meta[property="og:title"]').attr('content') || '';
        const description = $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || '';
        const keywords = $('meta[name="keywords"]').attr('content') || '';
        const canonical = $('link[rel="canonical"]').attr('href') || '';
        const robots = $('meta[name="robots"]').attr('content') || '';

        // Open Graph
        const ogTitle = $('meta[property="og:title"]').attr('content') || '';
        const ogDescription = $('meta[property="og:description"]').attr('content') || '';
        const ogImage = $('meta[property="og:image"]').attr('content') || '';
        const ogUrl = $('meta[property="og:url"]').attr('content') || '';

        // Twitter
        const twitterCard = $('meta[name="twitter:card"]').attr('content') || '';
        const twitterTitle = $('meta[name="twitter:title"]').attr('content') || '';
        const twitterDescription = $('meta[name="twitter:description"]').attr('content') || '';
        const twitterImage = $('meta[name="twitter:image"]').attr('content') || '';

        // Favicon
        let favicon = $('link[rel="icon"]').attr('href') || $('link[rel="shortcut icon"]').attr('href') || '';

        // Simplify favicon absolute path
        if (favicon && !favicon.startsWith('http') && !favicon.startsWith('//')) {
            if (favicon.startsWith('/')) {
                favicon = `${validUrl.origin}${favicon}`;
            } else {
                favicon = `${validUrl.origin}/${favicon}`;
            }
        } else if (favicon.startsWith('//')) {
            favicon = `${validUrl.protocol}${favicon}`;
        }

        const result = {
            title,
            description,
            keywords,
            canonical,
            robots,
            openGraph: {
                ogTitle,
                ogDescription,
                ogImage,
                ogUrl
            },
            twitter: {
                twitterCard,
                twitterTitle,
                twitterDescription,
                twitterImage
            },
            favicon
        };

        return res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {
        console.error('Meta Check Error:', error.message);
        if (error.response) {
            return res.status(error.response.status).json({
                success: false,
                message: `Failed to fetch URL: ${error.message}`
            });
        }
        // Handle DNS errors etc
        return res.status(400).json({
            success: false,
            message: 'Invalid or unreachable URL'
        });
    }
};
