import { faker } from '@faker-js/faker';
export { faker };
export type UserFormData = {
  name: string;
  emailOfficial: string;
  emailPersonal: string;
  phone: string;         // 10-digit numeric
  designation: string;
  organisation: string;
  industry: string;
  address: string;
  city: string;
};

// deterministic data per run (optional)
faker.seed(42);

// Generate Indian-style 10-digit mobile (starts 6–9)
function makeIndianMobileNumber(): string {
  const first = faker.number.int({ min: 9, max:9});
  const rest = faker.string.numeric(9);
  return `${first}${rest}`;
}

export function makeUser(): UserFormData {
  const first = faker.person.firstName();
  const last = faker.person.lastName();

  return {
    name: `${first} ${last}`,
    emailOfficial: faker.internet.email({ firstName: first, lastName: last, provider: 'examplecorp.com' }),
    emailPersonal: faker.internet.email({ firstName: first, lastName: last }),
    phone: makeIndianMobileNumber(), 
    designation: faker.person.jobTitle(),
    organisation: faker.company.name(), 
    industry: faker.commerce.department(),
    address: faker.location.streetAddress({ useFullAddress: true }),
    city: faker.location.city(),
    
  };
}
