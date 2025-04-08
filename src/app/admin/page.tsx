import ContactCardAdmin from '@/components/ContactCardAdmin';
import authOptions from '@/lib/authOptions';
import { adminProtectedPage } from '@/lib/page-protection';
import { prisma } from '@/lib/prisma';
import { Contact, Note } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { Col, Container, Row } from 'react-bootstrap';

const AdminPage = async () => {
  const session = await getServerSession(authOptions);
  adminProtectedPage(
    session as {
      user: { email: string; id: string; randomKey: string };
    } | null,
  );

  // Fetch contacts and include their associated notes
  const contactsWithNotes: (Contact & { notes: Note[] })[] = await prisma.contact.findMany({
    include: {
      notes: true,
    },
  });

  return (
    <main>
      <Container id="list" fluid className="py-3">
        <Row>
          <Col>
          <h1 className="text-center">List Contacts Admin</h1>
            <Row xs={1} md={2} lg={3} className="g-4">
              {contactsWithNotes.map((contact) => (
                <Col key={contact.firstName + contact.lastName}>
                  <ContactCardAdmin contact={contact} notes={contact.notes} />
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default AdminPage;
