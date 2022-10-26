Record = require('../model/recordModel')

const chai = require('chai')
const expect = chai.expect
const chaiHttp = require('chai-http')
const app = require('../index')

chai.use(chaiHttp)
chai.should()

beforeEach((done) => {
    Record.deleteMany({}, function(err){})
    done()
})

afterEach((done) => {
    Record.deleteMany({}, function(err){})
    done()
})

describe("GET - index pages", () => {

    it("GET / - should return status 200", (done) => {
        chai.request(app)
            .get('/')
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.a('object')
                done()
            })
    })

    it("GET /library - should return status 200", (done) => {
        chai.request(app)
            .get('/library')
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.a('object')
                done()
            })
    })
})

describe("GET /library - multiple scenarios", (done) => {
    it("GET: should return empty ", (done) => {
        chai.request(app)
            .get('/library/record')
            .end((err, res) => {
                res.should.have.status(200)
                expect(res.body.data.length).to.equal(0)
                done()
            })
    })

    it("GET: should return list of records of correct size and content", (done) => {
        let record = new Record({
            title: "Genshin Impact",
            author: "Hoyoverse",
            borrower: "Elon",
            contact_number: 99998888
        })
        record.save((err, record) => {
            chai.request(app)
                .get('/library/record')
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    res.body.should.have.property('data')
                    expect(res.body.data.length).to.equal(1)
                    done()
                })
        })
    })
})

describe("POST /library", () => {
    it("POST: should return correctly created record", (done) => {
        chai.request(app)
            .post('/library/record')
            .send({
                "title": "Game of Thrones",
                "author": "Martin",
                "borrower": "Xuanqi",
                "contact_number": 12345678
            })
            .end((err, res) => {
                res.should.have.status(200)
                expect(res.body.data.title).to.equal("Game of Thrones")
                expect(res.body.data.author).to.equal("Martin")
                expect(res.body.data.borrower).to.equal("Xuanqi")
                expect(res.body.data.contact_number).to.equal("12345678")
                done()
            })
    })

    it("POST: should return error due to missing title", (done) => {
        chai.request(app)
            .post('/library/record')
            .send({
                "author": "Martin",
                "borrower": "Xuanqi",
                "contact_number": 12345678
            })
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.a('object')
                res.body.should.have.property('errors')
                res.body.errors.should.have.property('title')
                res.body.errors.title.should.have.property('kind').eql('required')
                done()
            })
    })

    it("POST: should return error due to missing author", (done) => {
        chai.request(app)
            .post('/library/record')
            .send({
                "title": "Game of Thrones",
                "borrower": "Xuanqi",
                "contact_number": 12345678
            })
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.a('object')
                res.body.should.have.property('errors')
                res.body.errors.should.have.property('author')
                res.body.errors.author.should.have.property('kind').eql('required')
                done()
            })
    })
})

describe("GET/library/record/:id", (done) => {
    it("GET: should return the correct record", (done) => {
        let record = new Record({
            title: "Genshin Impact",
            author: "Hoyoverse",
            borrower: "Elon",
            contact_number: 99998888
        })
        record.save((err, record) => {
            chai.request(app)
                .get(`/library/record/${record._id.toHexString()}`)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    res.body.should.have.property('data')
                    res.body.data.should.have.property('title').eql("Genshin Impact")
                    res.body.data.should.have.property('author').eql("Hoyoverse")
                    res.body.data.should.have.property('borrower').eql("Elon")
                    res.body.data.should.have.property('contact_number').eql("99998888")
                    done()
                })
        })
    })

    it("GET: should not get anything with nonexistent id", (done) => {
        chai.request(app)
            .get('/library/record/6358131865e9a145ebb4b042')
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.have.property('data')
                expect(res.body.data).to.equal(null)
                done()
            })
    })
})

describe("PUT/library/record/:id", (done) => {
    it("PUT: should update a record given id", (done) => {
        let record = new Record({
            title: "Genshin Impact",
            author: "Hoyoverse",
            borrower: "Elon",
            contact_number: 99998888
        })
        record.save((err, record) => {
            chai.request(app)
                .put(`/library/record/${record._id.toHexString()}`)
                .send({
                    title: "Genshin Impact1",
                    author: "Hoyoverse1",
                    borrower: "Elon1",
                    contact_number: 99998887
                })
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    res.body.should.have.property('data')
                    res.body.data.should.have.property('title').eql("Genshin Impact1")
                    res.body.data.should.have.property('author').eql("Hoyoverse1")
                    res.body.data.should.have.property('borrower').eql("Elon1")
                    res.body.data.should.have.property('contact_number').eql("99998887")
                    done()
                })
        })
    })
})

describe("DELETE/library/record/:id", (done) => {
    it("DELETE: should delete a record given id", (done) => {
        let record = new Record({
            title: "Genshin Impact",
            author: "Hoyoverse",
            borrower: "Elon",
            contact_number: 99998888
        })
        record.save((err, record) => {
            chai.request(app)
                .delete(`/library/record/${record._id.toHexString()}`)
                .send({
                    title: "Genshin Impact1",
                    author: "Hoyoverse1",
                    borrower: "Elon1",
                    contact_number: 99998887
                })
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    res.body.should.have.property('status').eql('success')
                    res.body.should.have.property('message').eql('Record deleted')
                    done()
                })
        })
    })
})