// Editorial decisions from the September 22, 2026 content-quality review.
// Withdrawn stories have no replacement and return the site's genuine 404.
// Consolidated stories redirect permanently to their surviving article.
module.exports = {
    removed: [1, 2, 4, 7, 11],
    merged: { 8: 10, 20: 12, 25: 14 }
};
