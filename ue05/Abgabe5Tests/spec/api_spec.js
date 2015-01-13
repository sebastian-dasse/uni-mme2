"use strict";
/*
 @author Sven Spielvogel
 */

//use frisby as easy api-test module
//http://frisbyjs.com/
var frisby = require("frisby");

var base_url = "http://localhost:8000/api/v1/";
var delete_status = 204;

frisby.create("get streams")
	.get(base_url + "streams")
	.expectStatus(200)
	.expectHeaderContains("content-type", "application/json")
	.toss();

frisby.create("create a new stream")
	.post(base_url + "streams", {
		"name": "StreamTest",
		"description": "Description",
		"url": "rtmp://mystream.de/1234",
		"state": 1
	}, {
		json: true
	})
	.expectStatus(201)
	.expectJSON({
		name: "StreamTest",
		url: "rtmp://mystream.de/1234",
		description: "Description",
		state: 1
	})
	.expectHeaderContains("content-type", "application/json")
	.afterJSON(function(json) {
		console.log(json);
		frisby.create("get streams/" + json._id)
			.get(base_url + "streams/" + json._id)
			.expectStatus(200)
			.expectJSON({
				name: "StreamTest",
				url: "rtmp://mystream.de/1234",
				description: "Description",
				state: 1
			})
			.expectHeaderContains("content-type", "application/json")
			.toss();
		frisby.create("update streams on position " + json._id)
			.put(base_url + "streams/" + json._id, {
				"name": "StreamTestChanged",
				"url": "rtmp://mystream.de/12345",
				"description": "none",
				"state": 2
			}, {
				json: true
			})
			.expectStatus(200)
			.expectJSON({
				name: "StreamTestChanged",
				url: "rtmp://mystream.de/12345",
				description: "none",
				state: 2
			})
			.expectHeaderContains("content-type", "application/json")
			.toss();

		frisby.create("update streams on position " + json._id + " only name")
			.put(base_url + "streams/" + json._id, {
				"name": "StreamTestNameChanged"
			}, {
				json: true
			})
			.expectStatus(200)
			.expectJSON({
				name: "StreamTestNameChanged",
				url: "rtmp://mystream.de/12345",
				description: "none",
				state: 2
			})
			.expectHeaderContains("content-type", "application/json")
			.toss();

		frisby.create("update streams on position " + json._id + " only url")
			.put(base_url + "streams/" + json._id, {
				"url": "rtmp://mystream.de/123456"
			}, {
				json: true
			})
			.expectStatus(200)
			.expectJSON({
				name: "StreamTestNameChanged",
				url: "rtmp://mystream.de/123456",
				description: "none",
				state: 2
			})
			.expectHeaderContains("content-type", "application/json")
			.toss();
		frisby.create("update streams on position " + json._id + " only description")
			.put(base_url + "streams/" + json._id, {
				"description": "back"
			}, {
				json: true
			})
			.expectStatus(200)
			.expectJSON({
				name: "StreamTestNameChanged",
				url: "rtmp://mystream.de/123456",
				description: "back",
				state: 2
			})
			.expectHeaderContains("content-type", "application/json")
			.toss();
		frisby.create("update streams on position " + json._id + " only state")
			.put(base_url + "streams/" + json._id, {
				"state": 0
			}, {
				json: true
			})
			.expectStatus(200)
			.expectJSON({
				name: "StreamTestNameChanged",
				url: "rtmp://mystream.de/123456",
				description: "back",
				state: 0
			})
			.expectHeaderContains("content-type", "application/json")
			.toss();

		frisby.create("update streams on position " + json._id + " bad data")
			.put(base_url + "streams/" + json._id, {
				"kame": "peter",
				"kurl": "15"
			}, {
				json: true
			})
			.expectStatus(200)
			.expectJSON({
				name: "StreamTestNameChanged",
				url: "rtmp://mystream.de/123456",
				description: "back",
				state: 0
			})
			.expectHeaderContains("content-type", "application/json")
			.toss();
		frisby.create("get streams by name - true search term")
			.get(base_url + "streams?name=StreamTestNameChanged")
			.expectStatus(200)
			.expectBodyContains("StreamTestNameChanged")
			.afterJSON(function(json) {
				expect(json.length).toBeGreaterThan(0);
			})
			.expectHeaderContains("content-type", "application/json")
			.toss();
		frisby.create("get streams by name - true search term but only a part")
			.get(base_url + "streams?name=TestName")
			.expectStatus(200)
			.expectBodyContains("TestName")
			.afterJSON(function(json) {
				expect(json.length).toBeGreaterThan(0);
			})
			.expectHeaderContains("content-type", "application/json")
			.toss();
		frisby.create("get streams by name - true search term but only a part")
			.get(base_url + "streams?name=TestName")
			.expectStatus(200)
			.expectBodyContains("TestName")
			.afterJSON(function(json) {
				expect(json.length).toBeGreaterThan(0);
			})
			.expectHeaderContains("content-type", "application/json")
			.toss();
		frisby.create("get streams by name - true search term but only a part and lower cased")
			.get(base_url + "streams?name=testname")
			.expectStatus(200)
			.expectBodyContains("TestName")
			.afterJSON(function(json) {
				expect(json.length).toBeGreaterThan(0);
			})
			.expectHeaderContains("content-type", "application/json")
			.toss();
		frisby.create("get streams by name - false search term")
			.get(base_url + "streams?name=NeverTouchThisStupidString")
			.expectStatus(200)
			.expectHeaderContains("content-type", "application/json")
			.afterJSON(function(json) {

				expect(json.length).toBe(0);
			}).toss();

		frisby.create("delete stream/" + json._id)
			.delete(base_url + "streams/" + json._id)
			.expectStatus(delete_status)
			.toss();
	}).toss();

frisby.create("create a new stream without description")
	.post(base_url + "streams", {
		"name": "StreamTest",
		"url": "rtmp://mystream.de/1234",
		"state": 1
	}, {
		json: true
	})
	.expectStatus(201)
	.expectJSON({
		name: "StreamTest",
		url: "rtmp://mystream.de/1234",
		description: "",
		state: 1
	})
	.expectHeaderContains("content-type", "application/json")
	.afterJSON(function(json) {
		console.log(json);
		frisby.create("delete stream/" + json._id)
			.delete(base_url + "streams/" + json._id)
			.expectStatus(delete_status)
			.toss();
	}).toss();
frisby.create("create a new stream without state")
	.post(base_url + "streams", {
		"name": "StreamTest",
		"description": "Description",
		"url": "rtmp://mystream.de/1234"
	}, {
		json: true
	})
	.expectStatus(201)
	.expectJSON({
		name: "StreamTest",
		url: "rtmp://mystream.de/1234",
		description: "Description",
		state: 0
	})
	.expectHeaderContains("content-type", "application/json")
	.afterJSON(function(json) {
		console.log(json);
		frisby.create("delete stream/" + json._id)
			.delete(base_url + "streams/" + json._id)
			.expectStatus(delete_status)
			.toss();
	}).toss();

frisby.create("create a new stream without name")
	.post(base_url + "streams", {
		"description": "Description",
		"url": "rtmp://mystream.de/1234",
		"state": 1
	}, {
		json: true
	})
	.expectStatus(400)
	.expectHeaderContains("content-type", "application/json")
	.toss();

frisby.create("create a new stream without url")
	.post(base_url + "streams", {
		"name": "test",
		"description": "Description",
		"state": 1
	}, {
		json: true
	})
	.expectStatus(400)
	.expectHeaderContains("content-type", "application/json")
	.toss();

frisby.create("get invalid stream")
	.get(base_url + "streams/quatschmitsosse")
	.expectStatus(404)
	.expectJSON({
		type: "error"
	})
	.expectHeaderContains("content-type", "application/json")
	.toss();