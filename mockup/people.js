
const api_people_url = 'http://localhost:8080/api/people';
let personIndex = -1;
let arrPeople = [];

function getPeopleList() {

    fetch(api_people_url)
        .then(function(response){
            //extract JSON content
            return response.json();
        })
        .then(function(data){
            //sort array
            data.people.sort((a, b) => a.name.normalize().localeCompare(b.name.normalize()));
            let html = '<ul>';
            for(let i=0; i<data.people.length; i++){
                html += `<li id="${data.people[i].id}" class="app-directory-item">${data.people[i].name}</li>`
            }
                    html += '</ul>';
            document.getElementById('app-directory').innerHTML = html;
        })
        .then(function(data){
            //add event listener to the items in the directory list
            document.querySelectorAll('.app-directory-item').forEach(item => {
                item.addEventListener('click', event => {
                
                directoryClick(event);
                });
            })
        })

        .catch(error => console.log('Error fetching people data'));
}

//fetch data from people.json file
window.onload = function() {

    getPeopleList();
    document.getElementById('app-person-profile-header').classList.add('app-person-profile-empty');
    //$('#app-directory li:nth-child(1)').trigger('click');

}

function directoryClick(e) {
    let personid = e.target.id;
    loadProfile(personid);
}

function loadProfile(id) {
    fetch(api_people_url)
    .then(function(response){
        return response.json();
    })
    .then(function(data){

        arrPeople = data.people;
        for (let i = 0; i < arrPeople.length; i++) {
            if (arrPeople[i].id === id) {
                personIndex = i
                return personIndex;
                break;
            } 
        }

        if (personIndex === '') {
            alert("There was an error loading profile data.")
        }
    })
    .then(function(data){
            //use personindex to get profile data
            let profile_html = '';
            profile_html += `<div class="app-person-profile-photo" style="background-image: url(${arrPeople[personIndex].image})"></div>
                <h2 id="personName">${arrPeople[personIndex].name}</h2>
                <div class="app-person-profile-department">${arrPeople[personIndex].department}
                </div>
                <div class="app-person-profile-phone-number">
                <a href="tel:${arrPeople[personIndex].phone}">${arrPeople[personIndex].phone}</a>
                </div>
                <div class="app-person-profile-email">
                    <a href="mailto:${arrPeople[personIndex].email}">${arrPeople[personIndex].email}</a>
                </div>`
                document.getElementById('app-person-profile-header').innerHTML = profile_html;

            //get education data
            let education_html = '';
            education_html += ` 
                <div class="app-section-header">
                    <h3>Education</h3>
                </div>
                <div class="app-section-body">`

                for(let i=0; i < arrPeople[personIndex].education.length; i++){
                    education_html += `<div class="app-history-item">
                        <div class="app-history-item-dates">
                        ${arrPeople[personIndex].education[i].startYear}-${arrPeople[personIndex].education[i].endYear}
                        </div>
                        <div class="app-history-item-body">
                            <div class="app-history-item-title">${arrPeople[personIndex].education[i].institution}</div>
                            ${arrPeople[personIndex].education[i].degree}
                        </div>
                    </div>`
                }
                education_html += ` </div>`
                document.getElementById('app-person-education-container').innerHTML = education_html;

            //get work experience data
            let work_html = '';

            work_html += `<div class="app-section-header"><h3>Experience</h3></div>
                        <div class="app-section-body">`
            
            for(let i=0; i < arrPeople[personIndex].workExperience.length; i++){
                //check work experience endyear, if undefined set to 'Present'
                let endYear = `${arrPeople[personIndex].workExperience[i].endYear}`
                if (endYear === `undefined`) {
                    endYear = 'Present'
                } 

                work_html += `                    
                    <div class="app-history-item">
                        <div class="app-history-item-dates">
                        ${arrPeople[personIndex].workExperience[i].startYear}-${endYear}
                        </div>
                        <div class="app-history-item-body">
                            <div class="app-history-item-title">${arrPeople[personIndex].workExperience[i].institution}</div>
                            ${arrPeople[personIndex].workExperience[i].title}
                        </div>
                    </div>`
            }
                work_html += `</div>`
                document.getElementById('app-person-profile-header').classList.remove('app-person-profile-empty');
                document.getElementById('app-person-work-container').innerHTML = work_html;
        
        
    })
    
    .catch(error => console.log(error));
        
};

// function searchPerson() {

//     var input = document.getElementById("app-search-input").value;
//     input.trim();

//     fetch(api_people_url)
//     .then(function(response){
//         return response.json();
//     })
//     .then(function(data){
//         arrPeople = data.people;
//         for (let i = 0; i < arrPeople.length; i++) {
//             let arrName = arrPeople[i].name;
//             if (arrName.includes(input)) {
//                 personIndex = i
//                 loadProfile(personIndex);
//                 break;
//             } 
//             //consider duplicate matches
//         }

//         if (personIndex === -1) {
//             alert("No profile was found for " + input)
//         }
//     })
//     .catch(error => console.log(error));
//  };