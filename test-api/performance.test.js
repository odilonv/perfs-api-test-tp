/* eslint-disable no-undef */
import request from 'supertest';
import { calculatePercentiles, executeLoadTest } from './utils';
import {
  serverUrl, testDuration, usersCount
} from './config';

// Constants
const responseDurations = [];
let sessionToken = null;
let feedbackId = null;

// Setup and Authentication
beforeAll(async () => {
  const username = 'admin';
  const password = 'admin';
  const result = await request(serverUrl)
    .get('/login/')
    .query({ username, password });

  expect(result.status).toBe(200);
  const { token } = result.body;
  sessionToken = token;
}, 20000);

// Helper function for GET requests
const testGetRequest = async (endpoint) => {
  const response = await request(serverUrl)
    .get(endpoint)
    .set('authorization', sessionToken);
  expect(response.status).toBe(200);
};

// API Performance Tests
describe('API Performance Tests', () => {
  // GET /auth test
  describe('GET /auth', () => {
    it('should return 200 and valid JSON response', async () => {
      await executeLoadTest(() => testGetRequest('/auth'), testDuration, usersCount, responseDurations);
    }, testDuration);
  });

  // GET /contacts test
  describe('GET /contacts', () => {
    it('should return 200 and valid JSON response', async () => {
      await executeLoadTest(() => testGetRequest('/contacts'), testDuration, usersCount, responseDurations);
    }, testDuration);
  });

  // POST /feedback test
  describe('POST /feedback', () => {
    it('should create a feedback and return 200', async () => {
      const feedbackDetails = { name: 'John', message: 'This message is a test.' };

      await executeLoadTest(async () => {
        const response = await request(serverUrl)
          .post('/feedback')
          .set('authorization', sessionToken)
          .send(feedbackDetails);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id');
        // Store the feedback ID to use in the DELETE test
        feedbackId = response.body.id;
      }, testDuration, usersCount, responseDurations);
    }, testDuration);
  });

  // DELETE /feedback/:id test
  describe('DELETE /feedback/:id', () => {
    it('should return 404 if feedback is not found or 403 if unauthorized', async () => {
      await executeLoadTest(async () => {
        const feedbackFakeId = 'some-feedback-id';
        const response = await request(serverUrl)
          .delete(`/feedback/${feedbackFakeId}`)
          .set('authorization', sessionToken);

        // Expect either 404 or 403
        expect([404, 403]).toContain(response.status);
      }, testDuration, usersCount, responseDurations);
    }, testDuration);

    it('should delete feedback and return 200', async () => {
      if (!feedbackId) {
        throw new Error('No feedback created. Please create feedback first.');
      }

      await executeLoadTest(async () => {
        const response = await request(serverUrl)
          .delete(`/feedback/${feedbackId}`)
          .set('authorization', sessionToken);
        expect(response.status).toBe(200);
      }, testDuration, usersCount, responseDurations);
    }, testDuration);
  });

  // GET /feedback test
  describe('GET /feedback', () => {
    it('should return a list of feedback in JSON format', async () => {
      await executeLoadTest(async () => {
        const response = await request(serverUrl)
          .get('/feedback')
          .set('authorization', sessionToken);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
      }, testDuration, usersCount, responseDurations);
    }, testDuration);
  });

  // POST /contact test
  describe('POST /contact', () => {
    it('should create a contact and return 200', async () => {
      const contactDetails = {
        firstName: 'John',
        lastName: 'Does',
        message: 'This message is a test.',
        departureAt: new Date(),
        arrivedAt: new Date(),
        email: 'john.does@test.com',
        mobilePhone: '00000'
      };

      await executeLoadTest(async () => {
        const response = await request(serverUrl)
          .post('/contact')
          .set('authorization', sessionToken)
          .send(contactDetails);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id');
      }, testDuration, usersCount, responseDurations);
    }, testDuration);
  });

  // DELETE /contact/:id test
  describe('DELETE /contact/:id', () => {
    it('should return 404 or 403 if resource not found or unauthorized', async () => {
      const contactId = 'some-contact-id';
      const response = await request(serverUrl)
        .delete(`/contact/${contactId}`)
        .set('authorization', sessionToken);

      expect([404, 403]).toContain(response.status); // Expect either 404 or 403
    });
  });

  // After all tests, log performance metrics
  afterAll(() => {
    const totalRequests = responseDurations.length;
    const averageResponseTime = responseDurations.reduce((a, b) => a + b, 0) / totalRequests;

    const lowestResponseTime = Math.min(...responseDurations);
    const highestResponseTime = Math.max(...responseDurations);

    const percentiles = calculatePercentiles(responseDurations, [0.5, 0.9, 0.99]);

    console.log(`50th Percentile: ${percentiles[0.5]} ms`);
    console.log(`90th Percentile: ${percentiles[0.9]} ms`);
    console.log(`99th Percentile: ${percentiles[0.99]} ms`);

    console.log(`Average response time: ${averageResponseTime.toFixed(2)} ms`);
    console.log(`Maximum response time: ${highestResponseTime} ms`);
    console.log(`Minimum response time: ${lowestResponseTime} ms`);
    console.log(`Total responses: ${totalRequests}`);
  });
});
