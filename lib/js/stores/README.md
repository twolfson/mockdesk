# Stores
Stores are currently a hybrid of Flux's stores and Backbone's models.

## Reasoning
We don't currently need the abstractions of actions/dispatchers. As a result, we skip over their unnecessary tax in exchange for direct methods.

## Naming
We use the name `store` over `model` since these items are more like an object than an ORM.
