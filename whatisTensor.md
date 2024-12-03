tensors are a data structure
tensors could only include numerical data
backically its an array with extended super powers

1 simple data
simple data have a single value
and i have a 0 dimensons
whenewher we want to assign the the number for a tensor
code use tensor.scaler() which is

2 one dimensal array
a list of numbers in an array
mostly called as vector [1,2,3]
3d vector and one dimesoal tensor are different
to create a tensor one dimensoal array we write tf.tensor1d([1,2,3])

3 two dimensoal array
let values=[
[1,2,3],
[1,2,34],
[32,1,4]
]
the following represents the 2 dimesonal array the comnination of x,y,z matrices

tf.tensor2d(  
 [1,2,3],
[1,2,34],
[32,1,4])

this values store the data of image or other data

4 three dimensons
three dimensons array are required to generate the image
which if image is black and white 2d array would be usefull
but when the array is three dimensons the image need to store the value of rgb

let value= [
[[1,2,3],
    [1,2,34],
    [32,1,4]],
[[1,2,3],
    [1,2,34],
    [32,1,4]],
[[1,2,3],
    [1,2,34],
    [32,1,4]]
]

in tensors can be written in tf.tensor3d()

5 four dimensons increases the array contains with with each array

5 five dimensonal array



-----------------------

powerfull manipulation

const tensor=tf.tensor2d([1,2,3],[4,5,6])
const scaler=tf.scaler(2)
const newTensor=tensor.mul(scaler)
console.log(newTesnor=[2,4,6],[8,10,12])

we can even reshape the tensor 
let reshaped = tensor.reshape([6])

---------------------------
memory management
we need to dispose the tensors manually if we never dispose the variable/tensor
tf.dispose()
which helps for memory management
