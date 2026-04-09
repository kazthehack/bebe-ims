import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useHistory, useParams } from 'react-router-dom'
import PageContent from 'components/pages/PageContent'
import FormModal from 'components/reusable/modals/FormModal'
import ListFiltersRow from 'components/reusable/layouts/ListFiltersRow'
import BreadcrumbTitle from 'pages/common/BreadcrumbTitle'
import { useSitesResource } from 'hooks/bazaar/useBazaarApi'

const Surface = styled.div`
  background: #f3f5f7;
  border: 1px solid #e1e6ec;
  border-radius: 4px;
  padding: 14px;
`

const Toolbar = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 12px;
`

const PrimaryButton = styled.button`
  height: 38px;
  border: 1px solid #25384c;
  background: #25384c;
  color: #fff;
  border-radius: 4px;
  min-width: 88px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 700;
`

const Table = styled.div`
  display: grid;
  gap: 6px;
`

const PaginationBar = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
`

const PaginationButton = styled.button`
  height: 30px;
  border: 1px solid #bec8d3;
  background: #f0f3f6;
  color: #41576d;
  border-radius: 4px;
  min-width: 64px;
  cursor: pointer;
`

const Header = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.5fr 1.5fr 0.9fr 0.8fr;
  font-size: 12px;
  color: #4f6278;
  font-weight: 700;
  padding: 0 10px;
`

const Row = styled.button`
  display: grid;
  grid-template-columns: 1fr 1.5fr 1.5fr 0.9fr 0.8fr;
  border: 1px solid #d9e0e8;
  border-radius: 4px;
  background: #e6eaef;
  text-align: left;
  align-items: center;
  min-height: 52px;
  cursor: pointer;
`

const Cell = styled.div`
  padding: 0 10px;
  color: #243648;
  font-size: 13px;
`

const Section = styled.section`
  border: 1px solid #d7e0ec;
  border-radius: 4px;
  background: #fff;
  padding: 14px;
  margin-bottom: 10px;
`

const SectionTitle = styled.h3`
  margin: 0 0 10px;
  color: #243648;
  font-size: 16px;
`

const PageActions = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px 16px;
`

const Label = styled.div`
  color: #607589;
  font-size: 12px;
  margin-bottom: 4px;
`

const Value = styled.div`
  color: #243648;
  font-size: 14px;
  font-weight: 600;
  min-height: 38px;
  display: flex;
  align-items: center;
`

const Meta = styled.div`
  margin-top: 8px;
  color: #5f6e7d;
  font-size: 12px;
`

const Field = styled.div`
  margin-bottom: 10px;
`

const Input = styled.input`
  border: 1px solid #bec8d3;
  border-radius: 4px;
  height: 38px;
  padding: 0 10px;
  width: 100%;
  box-sizing: border-box;
  background: #f0f3f6;
`

const ErrorText = styled.div`
  color: #b42318;
  font-size: 12px;
  margin-top: 8px;
`

const SitesPage = () => {
  const history = useHistory()
  const { id } = useParams()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [formError, setFormError] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editLocation, setEditLocation] = useState('')
  const [editError, setEditError] = useState('')
  const {
    sites,
    loading,
    error,
    createSite,
    updateSite,
  } = useSitesResource()

  const filteredSites = useMemo(() => {
    const query = String(search || '').trim().toLowerCase()
    return (sites || []).filter((site) => {
      if (statusFilter === 'active' && !site.active) return false
      if (statusFilter === 'inactive' && site.active) return false
      if (!query) return true
      return [
        site.code,
        site.name,
        site.location,
        site.id,
      ].join(' ').toLowerCase().includes(query)
    })
  }, [sites, search, statusFilter])

  const selectedSite = useMemo(
    () => (sites || []).find((site) => site.id === id) || null,
    [sites, id],
  )
  const PAGE_SIZE = 20
  const totalPages = Math.max(1, Math.ceil((filteredSites || []).length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pagedSites = useMemo(
    () => (filteredSites || []).slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [filteredSites, safePage],
  )

  useEffect(() => {
    setPage(1)
  }, [filteredSites.length])

  useEffect(() => {
    if (!selectedSite) return
    setEditName(selectedSite.name || '')
    setEditLocation(selectedSite.location || '')
    setEditError('')
  }, [selectedSite])

  const title = id
    ? (
      <BreadcrumbTitle items={[
        { label: 'Sites', to: '/sites' },
        { label: 'Site Detail' },
      ]}
      />
    )
    : 'Sites'

  const handleCreate = async () => {
    setFormError('')
    if (!name.trim()) {
      setFormError('Name is required.')
      return
    }
    try {
      await createSite({
        name: name.trim(),
        location: location.trim() || null,
        active: true,
      })
      setName('')
      setLocation('')
      setShowCreateModal(false)
    } catch (err) {
      setFormError(err.message || 'Failed to create site.')
    }
  }

  const handleSaveEdit = async () => {
    if (!selectedSite) return
    setEditError('')
    if (!editName.trim()) {
      setEditError('Name is required.')
      return
    }
    try {
      await updateSite(selectedSite.id, {
        name: editName.trim(),
        location: editLocation.trim() || null,
        active: Boolean(selectedSite.active),
      })
      setIsEditing(false)
    } catch (err) {
      setEditError(err.message || 'Failed to update site.')
    }
  }

  return (
    <PageContent title={title}>
      {!id && (
        <Surface>
          <Toolbar>
            <ListFiltersRow
              searchValue={search}
              onSearchChange={setSearch}
              searchPlaceholder="Search code, name, location"
              filters={[
                {
                  key: 'site-status',
                  value: statusFilter,
                  onChange: setStatusFilter,
                  options: [
                    { value: 'all', label: 'All Status' },
                    { value: 'active', label: 'Active' },
                    { value: 'inactive', label: 'Inactive' },
                  ],
                },
              ]}
              right={<PrimaryButton type="button" onClick={() => setShowCreateModal(true)}>Add Site</PrimaryButton>}
            />
          </Toolbar>
          <Table>
            <Header>
              <div>Code</div>
              <div>Name</div>
              <div>Location</div>
              <div>Status</div>
              <div>Action</div>
            </Header>
            {pagedSites.map((site) => (
              <Row key={site.id} type="button" onClick={() => history.push(`/sites/${site.id}`)}>
                <Cell>{site.code}</Cell>
                <Cell>{site.name}</Cell>
                <Cell>{site.location || '-'}</Cell>
                <Cell>{site.active ? 'Active' : 'Inactive'}</Cell>
                <Cell>View</Cell>
              </Row>
            ))}
          </Table>
          {loading && <Meta>Loading sites...</Meta>}
          {!loading && !(sites || []).length && <Meta>No sites yet.</Meta>}
          {error && <Meta>{error}</Meta>}
          {!loading && (sites || []).length > 0 && (
            <PaginationBar>
              <Meta>Page {safePage} / {totalPages}</Meta>
              <PaginationButton type="button" onClick={() => setPage((prev) => Math.max(1, prev - 1))} disabled={safePage <= 1}>
                Prev
              </PaginationButton>
              <PaginationButton type="button" onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))} disabled={safePage >= totalPages}>
                Next
              </PaginationButton>
            </PaginationBar>
          )}
        </Surface>
      )}

      {id && (
        <>
          {!loading && selectedSite && (
            <PageActions>
              {!isEditing && <PrimaryButton type="button" onClick={() => setIsEditing(true)}>EDIT</PrimaryButton>}
              {isEditing && <PrimaryButton type="button" onClick={handleSaveEdit}>SAVE</PrimaryButton>}
              {isEditing && (
                <PaginationButton
                  type="button"
                  onClick={() => {
                    setIsEditing(false)
                    setEditName(selectedSite.name || '')
                    setEditLocation(selectedSite.location || '')
                    setEditError('')
                  }}
                >
                  CANCEL
                </PaginationButton>
              )}
            </PageActions>
          )}
          <Section>
          {loading && <Meta>Loading site detail...</Meta>}
          {!loading && !selectedSite && <Meta>Site not found.</Meta>}
          {!loading && selectedSite && (
            <>
              <SectionTitle>Site Details</SectionTitle>
              <Grid>
                <div>
                  <Label>Code</Label>
                  <Value>{selectedSite.code}</Value>
                </div>
                <div>
                  <Label>Name</Label>
                  {!isEditing && <Value>{selectedSite.name}</Value>}
                  {isEditing && <Input value={editName} onChange={(event) => setEditName(event.target.value)} />}
                </div>
                <div>
                  <Label>Location</Label>
                  {!isEditing && <Value>{selectedSite.location || '-'}</Value>}
                  {isEditing && <Input value={editLocation} onChange={(event) => setEditLocation(event.target.value)} />}
                </div>
                <div>
                  <Label>Status</Label>
                  <Value>{selectedSite.active ? 'Active' : 'Inactive'}</Value>
                </div>
              </Grid>
              {editError && <ErrorText>{editError}</ErrorText>}
            </>
          )}
          </Section>
        </>
      )}

      <FormModal
        open={showCreateModal}
        title="Add Site"
        onClose={() => {
          setShowCreateModal(false)
          setFormError('')
        }}
        onConfirm={handleCreate}
        confirmLabel="Create"
        cancelLabel="Exit"
        closeControl="dot"
      >
        <Field>
          <Label>Name</Label>
          <Input value={name} onChange={(event) => setName(event.target.value)} />
        </Field>
        <Field>
          <Label>Location</Label>
          <Input value={location} onChange={(event) => setLocation(event.target.value)} />
        </Field>
        {formError && <ErrorText>{formError}</ErrorText>}
      </FormModal>
    </PageContent>
  )
}

export default SitesPage
