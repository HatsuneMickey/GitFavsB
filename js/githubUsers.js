export class GithubUser {
    static search(username) {
        const endpoint = `https://api.github.com/users/${username}`

        // o fetch usa a endpoint que recebeu uma string, transforma em json que então é atribuída com novos dados.
        return fetch(endpoint)
        .then(data => data.json())
        .then(({ login, name, public_repos, followers }) => ({
            login,
            name,
            public_repos,
            followers,
        }))
    }
}