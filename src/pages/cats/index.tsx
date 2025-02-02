import Head from 'next/head'
import { Cat } from '@/domain/cat'
import { Table, Button, Form, Row, Col } from 'react-bootstrap'
import { CatsService } from '@/services/api/cats-service'
import Link from 'next/link'
import { useCallback, useState } from 'react'
import { MutateCat } from '@/components/MutateCat'
import { useRouter } from 'next/router'

const apiService = new CatsService('/api-cats');

export default function CatsPage({ cats } : any) {
  const [ showCreateCat, setShowCreateCat ] = useState<boolean>(false);
  const [ keyWords, setKeyWords ] = useState<string>('');
  const { push } = useRouter();

  const handleCreateNewCat = useCallback((newCat: Cat) => {
    apiService.create(newCat).then(() => {
      // refresh the page to show the new list
      location.reload();
    }).catch(console.error);
  }, []);

  const handleSearch = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    push(`/cats/?keywords=${keyWords}`);
  }, [keyWords, push]);

  const handleKeyWordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyWords(e.target.value);
  }, []);

  const handleDelete = useCallback((id: string) => {
    apiService.delete(id).then(() => {
      location.reload();
    }).catch(console.error);
  }, []);

  return (
    <>
      <Head>
        <title>View your cats</title>
        <meta name="description" content="Register your animal" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>View your cats</h1>
        <br />
        <Form onSubmit={handleSearch}>
          <Row>
            <Col xs="auto">
                <Form.Control type="text" placeholder="filer by cat name or description" defaultValue={keyWords} onChange={handleKeyWordChange}/>
            </Col>
            <Col xs="auto">
                <Button variant="primary" type="submit">
                Search
              </Button>
            </Col>
          </Row>
        </Form>
        <br />
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Description</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {cats?.length > 0 &&             
              cats.map((c: Cat) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.name}</td>
                  <td>{c.description}</td>
                  <td>
                    <Link href={`/cats/${c.id}`} className='btn btn-primary btn-auth0-cta btn-padded'>
                      View
                    </Link>
                    &nbsp;
                    <Link href={`/cats/${c.id}?isEdit=true`} className='btn btn-primary btn-auth0-cta btn-padded'>
                      Edit
                    </Link>
                    &nbsp;
                    <Button variant='danger' onClick={() => {
                      handleDelete(c.id);
                    }}>Delete</Button>
                  </td>
                </tr>                
              ))}
          </tbody>
        </Table>
        <div>
          {!showCreateCat && <Button onClick={() => {
            setShowCreateCat(true)
          }}>Create a new cat</Button>}

          {
            showCreateCat && <MutateCat 
              btnClickCallback={handleCreateNewCat}
            />
          }
        </div>
      </main>
    </>
  )
}

export async function getServerSideProps(context: any) {
    try {
      const service = new CatsService();
      const keyWords = context?.query?.keywords ?? null;
      const cats = await service.all(keyWords)
      return { props: { cats } }
    } catch (err) {
      console.error(err)
      return { notFound: true }
    }
}
