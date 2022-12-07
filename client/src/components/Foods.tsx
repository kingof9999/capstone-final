import dateFormat from 'dateformat'
import { History } from 'history'
import * as React from 'react'
import {
  Button,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader,
  Table
} from 'semantic-ui-react'

import { createFood, deleteFood, getFoods } from '../api/foods-api'
import Auth from '../auth/Auth'
import { Food } from '../types/Food'

interface FoodsProps {
  auth: Auth
  history: History
}

interface FoodsState {
  foods: Food[]
  newFoodName: string
  newPrice: string
  newIngredient: string
  loadingFoods: boolean
}

export class Foods extends React.PureComponent<FoodsProps, FoodsState> {
  state: FoodsState = {
    foods: [],
    newFoodName: '',
    newPrice: '',
    newIngredient: '',
    loadingFoods: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newFoodName: event.target.value })
  }

  handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newPrice: event.target.value })
  }

  handleIngredientChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newIngredient: event.target.value })
  }

  onEditButtonClick = (foodId: string) => {
    this.props.history.push(`/foods/${foodId}/edit`)
  }

  onFoodCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const newFood = await createFood(this.props.auth.getIdToken(), {
        name: this.state.newFoodName,
        price: this.state.newPrice,
        ingredient: this.state.newIngredient
      })
      this.setState({
        foods: [...this.state.foods, newFood],
        newFoodName: ''
      })
    } catch {
      alert('Food creation failed')
    }
  }

  onFoodDelete = async (foodId: string) => {
    try {
      await deleteFood(this.props.auth.getIdToken(), foodId)
      this.setState({
        foods: this.state.foods.filter(food => food.foodId !== foodId)
      })
    } catch {
      alert('Food deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const foods = await getFoods(this.props.auth.getIdToken())
      this.setState({
        foods,
        loadingFoods: false
      })
    } catch (e) {
      alert(`Failed to fetch foods: ${(e as Error).message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">FOODs</Header>

        {this.renderCreateFoodInput()}

        {this.renderFoods()}
      </div>
    )
  }

  renderCreateFoodInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
              action={{
                color: 'teal',
                labelPosition: 'right',
                icon: 'add',
                content: 'New food',
                onClick: this.onFoodCreate
              }}
              fluid
              actionPosition="left"
              placeholder="Input Name Food..."
              onChange={this.handleNameChange}
            />
          <Input
              fluid
              actionPosition="left"
              placeholder="Input Price..."
              onChange={this.handlePriceChange}
            />
          <Input
              fluid
              actionPosition="left"
              placeholder="Input Ingredient..."
              onChange={this.handleIngredientChange}
            />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderFoods() {
    if (this.state.loadingFoods) {
      return this.renderLoading()
    }

    return this.renderFoodsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading FOODs
        </Loader>
      </Grid.Row>
    )
  }

  renderFoodsList() {
    return (
      <Grid celled>
        {this.state.foods.map((food, pos) => {
          return (
            <Grid.Row key={food.foodId}>
              <Grid.Column width={3}>
                {food.attachmentUrl && (
                  <Image src={food.attachmentUrl} size="medium" wrapped />
                )}
              </Grid.Column>
              <Grid.Column width={12}>
                <Table definition>
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell width={2}>Price</Table.Cell>
                      <Table.Cell>{food.name}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>Price</Table.Cell>
                      <Table.Cell>{food.price}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>Ingredient</Table.Cell>
                      <Table.Cell>{food.ingredient}</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
              </Grid.Column>
              <Grid.Column width={1}>
                <Grid.Column width={1} floated="right">
                  <Button
                    icon
                    color="blue"
                    onClick={() => this.onEditButtonClick(food.foodId)}
                  >
                    <Icon name="pencil" />
                  </Button>
                </Grid.Column>
                <Grid.Column width={16}>
                  <Divider />
                </Grid.Column>
                <Grid.Column width={1} floated="right">
                  <Button
                    icon
                    color="red"
                    onClick={() => this.onFoodDelete(food.foodId)}
                  >
                    <Icon name="delete" />
                  </Button>
                </Grid.Column>
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
