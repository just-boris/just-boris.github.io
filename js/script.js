/* eslint-env browser */
(function() {
    'use strict';
    function fadeElement(element, text, direction) {
        element.textContent = text;
        element.classList.add('fade--' + direction);
        setTimeout(function() {
            element.classList.add('fade--in');
            element.classList.remove('fade--' + direction);
        }, 0);
    }
    function decline(number, one, many) {
        return (number || 'No') + ' ' + (number === 1 ? one : many);
    }
    function fetchFromGithub(path) {
        return fetch('https://api.github.com' + path).then(function(response) {
            if (response.status >= 200 && response.status < 300) {
                return response.json();
            } else {
                var error = new Error(response.statusText);
                error.response = response;
                throw error;
            }
        });
    }
    function fetchProfile() {
        fetchFromGithub('/users/just-boris').then(function(profile) {
            fadeElement(
                document.querySelector('.bio__company'),
                'Work at ' + profile.company,
                'top'
            );
            fadeElement(
                document.querySelector('.bio__location'),
                'Live in ' + profile.location,
                'top'
            );
        });
    }
    function fetchProject(projectElm) {
        var name = projectElm.getAttribute('data-name');
        return fetchFromGithub('/repos/' + name).then(function(repo) {
            fadeElement(
                projectElm.querySelector('.project__stars'),
                decline(repo.stargazers_count, 'star', 'stars'),
                'left'
            );
            fadeElement(
                projectElm.querySelector('.project__forks'),
                decline(repo.forks_count, 'fork', 'forks'),
                'left'
            );
        });
    }
    function init() {
        fetchProfile();
        Array.prototype.forEach.call(document.querySelectorAll('.project'), fetchProject);
    }
    if(document.readyState !== 'complete') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
