import { GithubUser } from "./githubUsers.js"

export class GitFav {
    constructor(root) {
        this.root = document.querySelector(root)
        this.load()
    }

    load() {
        this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
    }

    save() {
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
    }

    async add(username) {
        const userExists = this.entries.find(entry => entry.login === username)
        
        if(userExists) {
            throw new Error('Usuário já cadastrado.')
        }

        try {
            const user = await GithubUser.search(username)

            if(user.login === undefined) {
                throw new Error('Usuário não encontrado!')
            }

            this.entries = [user, ...this.entries] 
            this.update()
            this.save()
        }
        catch(error) {
            alert(error.message)
        }
    }

    delete(user) {
        const filteredEntries = this.entries.filter(entry => entry.login !== user.login)

        this.entries = filteredEntries
        this.update()
        this.save()
        // Call the function initially and whenever rows are removed
        updateTableWrapperHeight();
    }
}

export class GitFavsView extends GitFav {
    constructor(root) {
        super(root)

        this.tbody = this.root.querySelector('table tbody')

        this.update()
        this.onAdd()
    }

    onAdd() {
        const addButton = this.root.querySelector('.search button')
        addButton.onclick = () => {
            const { value } = this.root.querySelector('.search input')

            this.add(value)
        }
    }

    update() {
        this.deleteAllTr()

        this.entries.forEach(user => {
            const row = this.createRow()

            row.querySelector('.user-content img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user-content img').alt = `Imagem de ${user.name}`
            row.querySelector('.user-content a').href = `https://github.com/${user.login}`
            row.querySelector('.user-content p').textContent = user.name
            row.querySelector('.user-content span').textContent = user.login
            row.querySelector('.repositories').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followers

            row.querySelector('.remove').onclick = () => {
                const isOk = confirm('Tem certeza de que deseja remover este usuário dos favoritos?')

                if(isOk) {
                    this.delete(user)
                }
            }
            this.tbody.append(row)
        })
    }

    createRow() {
        const tr = document.createElement('tr')
        tr.innerHTML = `
            <td class="user">
                <div class="user-content">
                    <img src="https://github.com/maykbrito.png" alt="Imagem de Mayk Brito">
                    <a href="https://github.com/maykbrito" target="_blank">
                        <p>Mayk Brito</p>
                        <span>/maykbrito</span>
                    </a>
                </div>
            </td>
            <td class="repositories">
                123
            </td>
            <td class="followers">
                1234
            </td>
            <td>
                <button class="remove">Remover</button>
            </td>
        `

        return tr
    }

    deleteAllTr() {
        this.tbody.querySelectorAll('tr')
        .forEach((tr) => {
            tr.remove()
        })
    }

    updateTableWrapperHeight() {
            // Get the table wrapper element
            const tableWrapper = document.getElementById('#table-wrapper')

            const table = document.querySelector('table')

            return tableWrapper.style.height = table.clientHeight + 'px';
    }
}