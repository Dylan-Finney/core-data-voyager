import { memo } from "react";
import {getIntrospectionQuery,graphqlSync, printSchema, GraphQLString, buildSchema, printIntrospectionSchema,graphql,GraphQLSchema } from "graphql"
import { init, Voyager,GraphQLVoyager } from 'graphql-voyager';
import { useToast,Flex, Container, Button, Link, Select } from '@chakra-ui/react'
const axios = require('axios').default;
const API_URL = "https://api-eu-west-2.hygraph.com/v2/cl92tdav3367601t6dp65an90/master"

const Todos = ({ data }) => {
    const toast = useToast()
    console.log("data",data)
    console.log("axios",axios)
  console.log("child render");
  const introspectionTest = async () => {
    // https://api-eu-west-2.hygraph.com/v2/cl92tdav3367601t6dp65an90/master
    let result
    switch(data.git){
        case true:
            const response = await axios.get('https://raw.githubusercontent.com/Dylan-Finney/core-data-model/main/core-data-model.graphql')
            console.log(response.data)
            var schema = buildSchema(response.data);
                // return printIntrospectionSchema(graphqlSchemaObj)
            result = graphqlSync({schema, source: getIntrospectionQuery()});
            return result
        default:
            try{
                if (JSON.stringify(data) === JSON.stringify({})||data.url===""){
                    result = await axios.post(API_URL,{
                        query: getIntrospectionQuery()
                      }, {
                        headers: {
                          'Content-Type': 'application/json'
                        }
                      });
                } else {
                    result = await axios.post(data.url,{
                        query: getIntrospectionQuery()
                      }, {
                        headers: {
                          'Content-Type': 'application/json'
                        }
                      });
                }
                console.log(result)
                switch (data.filter){
                  case "full":
                    return result.data
                  default:
                    result = result.data.data.__schema.types
                    console.log(result)
                    let schema = result.filter(obj => obj.kind==="OBJECT"||obj.kind==="SCALAR"||obj.kind==="ENUM")
                    schema = schema.filter(obj => !["Aggregate",
                    "Asset",
                    "AssetConnection",
                    "AssetEdge",
                    "BatchPayload",
                    "Color",
                    "DocumentVersion",
                    "Location",
                    "Mutation",
                    "PageInfo",
                    "RGBA",
                    "RichText",
                    "ScheduledOperation",
                    "ScheduledOperationConnection",
                    "ScheduledOperationEdge",
                    "ScheduledRelease",
                    "ScheduledReleaseConnection",
                    "ScheduledReleaseEdge",
                    "Query",
                    "User",
                    "UserConnection",
                    "UserEdge",
                    "Version"
                    ].includes(obj.name))
                    schema = schema.filter(obj => !(obj.name.endsWith("Connection")||
                    obj.name.endsWith("Edge")||
                    obj.name.endsWith("OrderByInput")))
                    schema = schema.filter(obj => {
                        if (!obj.kind==="ENUM"){
                            return true
                        } else {
                            if (["DocumentFileTypes",
                            "ImageFit",
                            "Locale",
                            "ScheduledOperationStatus",
                            "ScheduledReleaseStatus",
                            "Stage",
                            "SystemDateTimeFieldVariation",
                            "UserKind",
                            "_FilterKind",
                            "_MutationInputFieldKind",
                            "_MutationKind",
                            "_OrderDirection",
                            "_RelationInputCardinality",
                            "_RelationInputKind",
                            "_RelationKind",
                            "_SystemDateTimeFieldVariation"
                        ].includes(obj.name)){
                                return false
                            } else {
                                return true
                            }
                        }
                    })
                    let important = []
                    for (var i = 0; i < schema.length; i++){
                      for (var x = 0; x < schema[i].interfaces.length; x++){
                        switch(schema[i].interfaces[x].name){
                          case "Node":
                            important.push(schema[i].name)
                            break
                          default:
                            break;
                        }
                      } 
                      schema[i].interfaces = schema[i].interfaces.filter(obj => {
                        switch(obj.name){
                          case "Node":
                            return false
                          default:
                            break;
                        }
                        return true
                      }) 
                      schema[i].fields = schema[i].fields.filter(obj => {
                        switch(obj.name){
                          case "stage":
                          case "documentInStages":
                          case "publishedAt":
                          case "updatedAt":
                          case "createdAt":
                          case "id":
                          case "publishedBy":
                          case "updatedBy":
                          case "createdBy":
                          case "scheduledIn":
                          case "history":
                            return false
                          default:
                            break;
                        }
                        return true
                      })
                      for (var x = 0; x < schema[i].fields.length; x++){
                        if (schema[i].fields[x].args.length > 0){
                          console.log("x", schema[i].fields[x].args)
                          schema[i].fields[x].args = schema[i].fields[x].args.filter(obj => {
                            console.log("x", obj);
                            switch(obj.name){
                              case "locales":
                              case "where":
                              case "orderBy":
                              case "skip":
                              case "after":
                              case "before":
                              case "first":
                              case "last":
                                return false
                              default:
                                break;
                            }
                            return true
                          })
                        }
                        if (schema[i].fields[x].type.name === "String"){
                          schema[i].fields[x].type = GraphQLString
                        }
                      } 
                    }
                    console.log(schema)
                    console.log(important)
                    let query = {
                      description: "The data objects that can be called for",
                      enumValues: [],
                      fields: [],
                      inputFields: [],
                      interfaces: [],
                      kind: "OBJECT",
                      name: "Query",
                      possibleTypes: [],
            
                    }
                    for (var i =0; i<important.length;i++){
                      query.fields.push({
                        args: [],
                        deprecationReason: null,
                        description: "",
                        isDeprecated: false,
                        name: important[i].toLowerCase(),
                        type: {
                          kind: "OBJECT",
                          name: important[i],
                          ofType: null,
                        },
                      })
                    }
                    schema.push(query)
                    return {
                        data: {__schema:{
                            directives: [],
                            mutationType: null,
                            queryType: {
                              name: "Query"
                            },
                            subscriptionType: null,
                            types: schema,
                          }}
                    }
                }
            } catch (e) {
                  console.error(e)
                  switch(e.name){
                    case "AxiosError":
                      toast({
                        title: 'API Error.',
                        description: "Error Fetching Data From API",
                        status: 'error',
                        duration: 9000,
                        isClosable: true,
                      })
                      break
                    default:
                      toast({
                        title: 'SDL Schema Failure.',
                        description: "Error in process. See Console for more details",
                        status: 'error',
                        duration: 9000,
                        isClosable: true,
                      })
                      break
                  }
                // Construct a schema, using GraphQL schema language
                var schema = buildSchema(`
                type Query {
                hello: String
                }
                `);
                // return printIntrospectionSchema(graphqlSchemaObj)
                const result = graphqlSync({schema, source: getIntrospectionQuery()});
                console.log("R",result)
                return result
            }
    }
    

    // }
    
  }
  return (
    <>
      <Voyager
      introspection={introspectionTest}
      // ...
      workerURI={process.env.PUBLIC_URL + '/voyager.worker.js'}
        // ...
      />
    </>
  );
};

export default memo(Todos);
