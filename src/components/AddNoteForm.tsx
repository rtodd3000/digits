'use client';

import LoadingSpinner from '@/components/LoadingSpinner';
import { addNote } from '@/lib/dbActions';
import { AddNoteSchema } from '@/lib/validationSchemas';
import { yupResolver } from '@hookform/resolvers/yup';
import { Contact } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import swal from 'sweetalert';

const onSubmit = async (data: { note: string; contactId: string; owner: string; }) => {
  await addNote(data);
  swal('Success', 'Your contact has been added', 'success', {
    timer: 2000,
  });
};

const AddNoteForm = ({ contact }: { contact: Contact }) => {
  const { data: session, status } = useSession();
  const currentUser = session?.user?.email || '';
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(AddNoteSchema),
  });

  if (status === 'loading') {
    return <LoadingSpinner />;
  }
  if (status === 'unauthenticated') {
    redirect('/auth/signin');
  }

  return (
    <Card>
      <Card.Header>Add Timestamped Note</Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group>
            <Form.Label>Note</Form.Label>
            <input
              type="text"
              {...register('note')}
              className={`form-control ${errors.note ? 'is-invalid' : ''}`}
            />
            <div className="invalid-feedback">{errors.note?.message}</div>
          </Form.Group>
          <input type="hidden" {...register('owner')} value={currentUser} />
          <input type="hidden" {...register('contactId')} value={contact.id} />
          <Form.Group className="form-group">
            <Row className="pt-3">
              <Col>
                <Button type="submit" variant="primary">Submit</Button>
              </Col>
              <Col>
                <Button
                  type="button"
                  onClick={() => reset()}
                  variant="warning"
                  className="float-right"
                >
                  Reset
                </Button>
              </Col>
            </Row>
          </Form.Group>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default AddNoteForm;
