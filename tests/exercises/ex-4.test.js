const SqlTestUtils = require('../sql_test_utils')

describe("exercise4", () => {
    const testUtils = new SqlTestUtils(["patient", "disease"], "ex_4", ["patient", "ethnicity", "gender", "disease", "symptoms"])

    afterEach(async done => {
        await testUtils.dropAndEndConnection()
        done()
    })

    it('Your should query for the survival rate of all the sick patients and order them in ascending order of ID. Your query should only return 2 columns', async (done) => {
        await testUtils.createSQLConnection()

        await testUtils.tableSetup([
            `
            CREATE TABLE ethnicity (
                id   INT NOT NULL PRIMARY KEY,
                name VARCHAR(20)
            );
            CREATE TABLE gender (
                id   INT NOT NULL PRIMARY KEY,
                name VARCHAR(20)
            );
            CREATE TABLE symptoms (
                family      INT NOT NULL PRIMARY KEY,
                fever       BOOLEAN,
                blue_whelts BOOLEAN,
                low_bp      BOOLEAN
            );
            CREATE TABLE disease (
                name          VARCHAR(20) NOT NULL PRIMARY KEY,
                survival_rate FLOAT
            );
            CREATE TABLE patient(
                id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                ethnicity INT,
                FOREIGN KEY(ethnicity) REFERENCES ethnicity(id),
                gender INT,
                FOREIGN KEY(gender) REFERENCES gender(id),
                symptoms_family INT,
                FOREIGN KEY(symptoms_family) REFERENCES symptoms(family),
                disease VARCHAR(20),
                FOREIGN KEY(disease) REFERENCES disease(name)
            );

            INSERT INTO ethnicity VALUES(0, "asian");
            INSERT INTO ethnicity VALUES(1, "black");
            INSERT INTO ethnicity VALUES(2, "hispanic");
            INSERT INTO ethnicity VALUES(3, "white");

            INSERT INTO gender VALUES(0, "female");
            INSERT INTO gender VALUES(1, "male");

            INSERT INTO symptoms VALUES(0, 1, 1, 1);
            INSERT INTO symptoms VALUES(1, 0, 1, 1);
            INSERT INTO symptoms VALUES(2, 0, 0, 1);
            INSERT INTO symptoms VALUES(3, 0, 0, 0);
            INSERT INTO symptoms VALUES(4, 1, 0, 1);
            INSERT INTO symptoms VALUES(5, 1, 0, 0);
            INSERT INTO symptoms VALUES(6, 1, 1, 0);
            INSERT INTO symptoms VALUES(7, 0, 1, 0);

            INSERT INTO disease VALUES("cabbage disease", 0.2);
            INSERT INTO disease VALUES("lettuce disease", 0.35);

            INSERT INTO patient VALUES(null, 0, 1, 7, 'cabbage disease');
            INSERT INTO patient VALUES(null, 1, 0, 3, null);
            INSERT INTO patient VALUES(null, 0, 0, 7, null);
            INSERT INTO patient VALUES(null, 2, 1, 0, null);
            INSERT INTO patient VALUES(null, 3, 1, 3, null);
            INSERT INTO patient VALUES(null, 0, 1, 7, 'cabbage disease');
            INSERT INTO patient VALUES(null, 2, 0, 0, null);
            INSERT INTO patient VALUES(null, 1, 0, 4, 'cabbage disease');
            INSERT INTO patient VALUES(null, 1, 1, 0, null);
            INSERT INTO patient VALUES(null, 1, 0, 3, null);
            INSERT INTO patient VALUES(null, 2, 0, 0, null);
            INSERT INTO patient VALUES(null, 0, 1, 7, 'cabbage disease');
            INSERT INTO patient VALUES(null, 0, 1, 0, 'lettuce disease');
            INSERT INTO patient VALUES(null, 0, 0, 7, null);
            INSERT INTO patient VALUES(null, 0, 1, 7, 'lettuce disease');`
        ])

        let studentQuery = await testUtils.getStudentQuery()
        expect(studentQuery.error, studentQuery.errorMessage, 'Your query should not return any errors').toBeFalsy()

        studentQuery = studentQuery.query
        let result = await testUtils.getQueryResult(studentQuery)

        expect(result.result, result.message, 'Your query results should not be null').not.toBeNull()
        result = result.result

        expect(result.length, 'Your query returns the wrong number of results. Make sure you only querying the sick patients').toBe(6)

        expect(result[0], 'You seemed to have used the GROUP BY order incorrectly').toEqual({ id: 1, survival_rate: 0.2 })
        expect(result[1], 'You seemed to have used the GROUP BY order incorrectly').toEqual({ id: 6, survival_rate: 0.2 })
        expect(result[2], 'You seemed to have used the GROUP BY order incorrectly').toEqual({ id: 8, survival_rate: 0.2 })
        expect(result[3], 'You seemed to have used the GROUP BY order incorrectly').toEqual({ id: 12, survival_rate: 0.2 })
        expect(result[4], 'You seemed to have used the GROUP BY order incorrectly').toEqual({ id: 13, survival_rate: 0.35 })
        expect(result[5], 'You seemed to have used the GROUP BY order incorrectly').toEqual({ id: 15, survival_rate: 0.35 })

        done()
    })
})
