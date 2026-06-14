function escapeXml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function toXml(data, tagName) {
    if (Array.isArray(data)) {
        return `<${tagName}>${data.map(item => toXml(item, 'item')).join('')}</${tagName}>`;
    }

    if (data !== null && typeof data === 'object') {
        const content = Object.keys(data)
            .map(key => toXml(data[key], key))
            .join('');

        return `<${tagName}>${content}</${tagName}>`;
    }

    return `<${tagName}>${escapeXml(data)}</${tagName}>`;
}

function wantsXml(req) {
    const format = req.query.format;
    const acceptHeader = req.headers.accept || '';

    return format === 'xml' || acceptHeader.includes('application/xml');
}

function sendResponse(req, res, statusCode, data, rootName = 'response') {
    if (wantsXml(req)) {
        res.status(statusCode).type('application/xml').send(toXml(data, rootName));
        return;
    }

    res.status(statusCode).json(data);
}

module.exports = {
    sendResponse
};
