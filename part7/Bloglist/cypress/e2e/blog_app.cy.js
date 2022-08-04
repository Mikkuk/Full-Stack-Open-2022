describe('Blog app', function() {
    beforeEach(function() {
        cy.request('POST', 'http://localhost:3003/api/testing/reset')
        const user = {
            username: 'testuser',
            name: 'tester',
            password: 'salaisuus'
        }
        cy.request('POST', 'http://localhost:3003/api/users/', user)
        cy.visit('http://localhost:3000')
    })

    it('Login form is shown', function() {
        cy.contains('log in to application')
    })

    describe('Login',function() {
        it('succeeds with correct credentials', function() {
            cy.get('#username').type('testuser')
            cy.get('#password').type('salaisuus')
            cy.get('#login-button').click()

            cy.contains('testuser logged in')
        })

        it('fails with wrong credentials', function() {
            cy.get('#username').type('wrong')
            cy.get('#password').type('wrong')
            cy.get('#login-button').click()

            cy.contains('wrong username or password')
        })
    })
    describe('When logged in', function() {
        beforeEach(function() {
            cy.login({ username: 'testuser', password: 'salaisuus'})
        })

        it('A blog can be created', function() {
            cy.contains('new blog').click()
            cy.get('#title').type('testblogtitle')
            cy.get('#author').type('testblogauthor')
            cy.get('#url').type('testblogurl')
            cy.get('#submit-button').click()
            cy.contains('testblogtitle')
        })

        describe('and a blog exists', function () {
            beforeEach(function () {
                cy.createBlog({
                    title: 'testblog',
                    author: 'tester',
                    url: 'testurl'
                })
            })

            it('Blog can be liked', function() {
                cy.contains('view').click()
                cy.get('#like-button').click()
                cy.get('#like-button').click()
                cy.get('#like-button').click()
                cy.get('#like-button').click()
                cy.contains('likes: 1')
            })

            it('Blog can be deleted', function () {
                cy.contains('view').click()
                cy.get('#remove-button').click()
                cy.contains('testblog').should('not.exist')
            })
        })

        describe('and more than one blog exists', function () {
            beforeEach(function () {
                cy.createBlog({
                    title: 'testblog',
                    author: 'tester',
                    url: 'testurl'
                })
                cy.createBlog({
                    title: 'testblog2',
                    author: 'tester2',
                    url: 'testurl2'
                })
            })
            it('Blogs are in order based on likes', function () {
                //
            })
        })
    })
})