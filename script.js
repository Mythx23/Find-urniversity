// Sample university dataset - you can expand this or fetch from an API
const universities = [
  { name: "Massachusetts Institute of Technology", country: "USA", minGPA: 3.9, rank: 1, majors: ["Computer Science", "Engineering", "Business"] },
  { name: "Stanford University", country: "USA", minGPA: 3.9, rank: 2, majors: ["Computer Science", "Engineering", "Business", "Medicine"] },
  { name: "Harvard University", country: "USA", minGPA: 3.9, rank: 3, majors: ["Business", "Law", "Medicine", "Arts"] },
  { name: "University of Cambridge", country: "UK", minGPA: 3.8, rank: 4, majors: ["Engineering", "Medicine", "Law", "Arts"] },
  { name: "University of Oxford", country: "UK", minGPA: 3.8, rank: 5, majors: ["Law", "Medicine", "Arts", "Business"] },
  { name: "California Institute of Technology", country: "USA", minGPA: 3.9, rank: 6, majors: ["Engineering", "Computer Science"] },
  { name: "Imperial College London", country: "UK", minGPA: 3.7, rank: 7, majors: ["Engineering", "Computer Science", "Medicine"] },
  { name: "ETH Zurich", country: "Germany", minGPA: 3.6, rank: 8, majors: ["Engineering", "Computer Science"] },
  { name: "National University of Singapore", country: "Singapore", minGPA: 3.6, rank: 9, majors: ["Engineering", "Business", "Computer Science"] },
  { name: "University of Toronto", country: "Canada", minGPA: 3.5, rank: 10, majors: ["Computer Science", "Engineering", "Medicine", "Business"] },
  { name: "University of Melbourne", country: "Australia", minGPA: 3.4, rank: 11, majors: ["Business", "Arts", "Medicine", "Law"] },
  { name: "McGill University", country: "Canada", minGPA: 3.4, rank: 12, majors: ["Medicine", "Engineering", "Arts"] },
  { name: "Australian National University", country: "Australia", minGPA: 3.3, rank: 13, majors: ["Law", "Business", "Arts"] },
  { name: "University of British Columbia", country: "Canada", minGPA: 3.3, rank: 14, majors: ["Computer Science", "Business", "Arts"] },
  { name: "Technical University of Munich", country: "Germany", minGPA: 3.2, rank: 15, majors: ["Engineering", "Computer Science"] },
  { name: "University of Sydney", country: "Australia", minGPA: 3.2, rank: 16, majors: ["Medicine", "Law", "Business", "Arts"] },
  { name: "King's College London", country: "UK", minGPA: 3.3, rank: 17, majors: ["Law", "Medicine", "Arts"] },
  { name: "University of Edinburgh", country: "UK", minGPA: 3.2, rank: 18, majors: ["Arts", "Engineering", "Medicine"] },
  { name: "Heidelberg University", country: "Germany", minGPA: 3.0, rank: 19, majors: ["Medicine", "Arts", "Law"] },
  { name: "Nanyang Technological University", country: "Singapore", minGPA: 3.4, rank: 20, majors: ["Engineering", "Business", "Computer Science"] },
  { name: "University of Waterloo", country: "Canada", minGPA: 3.0, rank: 25, majors: ["Computer Science", "Engineering"] },
  { name: "Monash University", country: "Australia", minGPA: 2.8, rank: 30, majors: ["Business", "Engineering", "Medicine", "Arts"] },
  { name: "Free University of Berlin", country: "Germany", minGPA: 2.7, rank: 35, majors: ["Arts", "Law", "Business"] },
  { name: "University of Manchester", country: "UK", minGPA: 2.9, rank: 32, majors: ["Engineering", "Business", "Arts"] },
  { name: "Purdue University", country: "USA", minGPA: 2.8, rank: 40, majors: ["Engineering", "Computer Science", "Business"] },
  { name: "Arizona State University", country: "USA", minGPA: 2.5, rank: 50, majors: ["Business", "Engineering", "Arts"] },
  { name: "University of Calgary", country: "Canada", minGPA: 2.5, rank: 55, majors: ["Engineering", "Business", "Arts"] },
  { name: "Griffith University", country: "Australia", minGPA: 2.3, rank: 60, majors: ["Business", "Arts", "Law"] },
  { name: "University of Bremen", country: "Germany", minGPA: 2.2, rank: 70, majors: ["Engineering", "Arts"] },
  { name: "Singapore Management University", country: "Singapore", minGPA: 3.0, rank: 45, majors: ["Business", "Law"] }
];

function getCategory(userGPA, minGPA) {
  const diff = userGPA - minGPA;
  if (diff >= 0.3) return { label: "Safety", className: "gpa-safety" };
  if (diff >= -0.1) return { label: "Match", className: "gpa-match" };
  return { label: "Reach", className: "gpa-reach" };
}

function findUniversities() {
  const gpa = parseFloat(document.getElementById('gpa').value);
  const country = document.getElementById('country').value;
  const major = document.getElementById('major').value;
  const sortBy = document.getElementById('sort').value;

  if (isNaN(gpa) || gpa < 0 || gpa > 4) {
    alert("Please enter a valid GPA between 0.0 and 4.0");
    return;
  }

  // Filter universities: include "reach" schools up to 0.3 above user's GPA
  let filtered = universities.filter(uni => {
    const gpaOk = uni.minGPA <= gpa + 0.3;
    const countryOk = country === "all" || uni.country === country;
    const majorOk = major === "all" || uni.majors.includes(major);
    return gpaOk && countryOk && majorOk;
  });

  // Sort results
  switch (sortBy) {
    case 'rank':
      filtered.sort((a, b) => a.rank - b.rank);
      break;
    case 'country':
      filtered.sort((a, b) => a.country.localeCompare(b.country) || a.rank - b.rank);
      break;
    case 'name':
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'match':
    default:
      // Best match: closest to user's GPA but still admissible, then by rank
      filtered.sort((a, b) => {
        const aDiff = Math.abs(gpa - a.minGPA);
        const bDiff = Math.abs(gpa - b.minGPA);
        if (Math.abs(aDiff - bDiff) < 0.1) return a.rank - b.rank;
        return aDiff - bDiff;
      });
  }

  renderResults(filtered, gpa);
}

function renderResults(list, userGPA) {
  const container = document.getElementById('universityList');
  const title = document.getElementById('resultsTitle');

  title.textContent = `Found ${list.length} Universit${list.length === 1 ? 'y' : 'ies'}`;

  if (list.length === 0) {
    container.innerHTML = `<div class="no-results">
      <h3>😔 No universities found</h3>
      <p>Try adjusting your filters or GPA range.</p>
    </div>`;
    return;
  }

  container.innerHTML = list.map(uni => {
    const cat = getCategory(userGPA, uni.minGPA);
    return `
      <div class="university-card">
        <div class="uni-info">
          <h3>${uni.name}</h3>
          <p>📍 ${uni.country}</p>
          <p>📚 Majors: ${uni.majors.join(', ')}</p>
          <p>📊 Min GPA: ${uni.minGPA.toFixed(1)}</p>
        </div>
        <div class="uni-stats">
          <span class="gpa-badge ${cat.className}">${cat.label}</span>
          <div class="rank">World Rank #${uni.rank}</div>
        </div>
      </div>
    `;
  }).join('');

  // Run on initial load (only when called from DOMContentLoaded)
}

// Run the search once the page loads
document.addEventListener('DOMContentLoaded', findUniversities);
