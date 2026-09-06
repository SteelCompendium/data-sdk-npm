import validator from '../../validation/validator';

describe('Downtime project schema', () => {
    test('accepts a delegating project without inventing requirements', async () => {
        expect((await validator.validateJSON({ name: 'Imbue Treasure', type: 'project', content: 'See the following projects.' }, 'project.schema.json')).valid).toBe(true);
    });
    test('preserves linked requirements and qualified goals as strings', async () => {
        const project = { name: 'Road', type: 'project', item_prerequisite: 'None', project_source: 'A [manual](scc.v1:example)', project_roll_characteristic: 'Might or Reason', project_goal: '45 (per mile)' };
        expect((await validator.validateJSON(project, 'project.schema.json')).valid).toBe(true);
        expect((await validator.validateJSON({ ...project, project_goal: 45 }, 'project.schema.json')).valid).toBe(false);
        expect((await validator.validateJSON({ ...project, typo: true }, 'project.schema.json')).valid).toBe(false);
    });
});
